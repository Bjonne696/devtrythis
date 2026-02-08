import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VIPPS_WEBHOOK_SECRET = Deno.env.get("VIPPS_WEBHOOK_SECRET")!;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function verifyVippsSignature(
  req: Request,
  rawBody: string,
  secret: string
): Promise<boolean> {
  try {
    const authHeader = req.headers.get("Authorization") || "";
    const xMsDate = req.headers.get("x-ms-date") || "";
    const xMsContentSha256 = req.headers.get("x-ms-content-sha256") || "";
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";

    if (!authHeader.startsWith("HMAC-SHA256")) {
      console.error("Auth header not HMAC-SHA256. Got:", authHeader.substring(0, 60));
      return false;
    }

    const signatureMatch = authHeader.match(/Signature=(.+)$/);
    if (!signatureMatch) {
      console.error("Could not extract Signature from Authorization header");
      return false;
    }
    const providedSignature = signatureMatch[1];

    const encoder = new TextEncoder();
    const bodyHashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(rawBody));
    const computedBodyHash = arrayBufferToBase64(bodyHashBuffer);

    if (computedBodyHash !== xMsContentSha256) {
      console.error("Body hash mismatch. Computed:", computedBodyHash, "Header:", xMsContentSha256);
      return false;
    }

    const url = new URL(req.url);
    const pathAndQuery = url.pathname + url.search;

    const method = req.method;
    const stringToSign =
      `${method}\n${pathAndQuery}\n${xMsDate};${host};${xMsContentSha256}`;

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(stringToSign));
    const computedSignature = arrayBufferToBase64(signatureBuffer);

    if (computedSignature !== providedSignature) {
      console.error("Signature mismatch. Check VIPPS_WEBHOOK_SECRET.");
      console.error("String to sign:", JSON.stringify(stringToSign));
      console.error("Host used:", host, "Path:", pathAndQuery);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

function extractEventId(payload: Record<string, unknown>): string | null {
  if (payload.chargeId && payload.eventType) {
    return `${payload.chargeId}-${payload.eventType}-${payload.occurred || ""}`;
  }
  if (payload.agreementId && payload.eventType) {
    return `${payload.agreementId}-${payload.eventType}-${payload.occurred || ""}`;
  }
  if (payload.eventId) return String(payload.eventId);
  if (payload.id) return String(payload.id);
  if (payload.reference) return String(payload.reference);
  return null;
}

function extractEventType(payload: Record<string, unknown>): string {
  return String(payload.eventType || payload.name || "unknown");
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const rawBody = await req.text();

    const isValid = await verifyVippsSignature(req, rawBody, VIPPS_WEBHOOK_SECRET);
    if (!isValid) {
      console.error("Invalid webhook signature - rejecting request");
      return new Response(
        JSON.stringify({ error: "Ugyldig signatur" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const payload = JSON.parse(rawBody);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const eventId = extractEventId(payload);
    if (!eventId) {
      console.error("Could not construct event ID. Payload keys:", Object.keys(payload));
      return new Response(
        JSON.stringify({ error: "Mangler event-ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const eventType = extractEventType(payload);
    console.log(`Processing webhook: eventType=${eventType}, eventId=${eventId}`);

    const { data: existingEvent } = await supabase
      .from("payment_events")
      .select("id")
      .eq("provider_event_id", eventId)
      .maybeSingle();

    if (existingEvent) {
      console.log(`Event ${eventId} already processed, skipping`);
      return new Response(JSON.stringify({ status: "already_processed" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    await supabase.from("payment_events").insert({
      provider_event_id: eventId,
      event_type: eventType,
      payload: payload,
      processed_at: new Date().toISOString(),
    });

    const agreementId = payload.agreementId as string | undefined;

    if (!agreementId) {
      console.log(`No agreementId in payload for event: ${eventType}`);
      return new Response(JSON.stringify({ status: "ok", note: "no agreementId" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (eventType === "recurring.agreement-activated.v1") {
      await handleAgreementActivated(supabase, agreementId);
    } else if (eventType === "recurring.agreement-stopped.v1") {
      await handleAgreementStopped(supabase, agreementId);
    } else if (eventType === "recurring.agreement-expired.v1") {
      await handleAgreementExpired(supabase, agreementId);
    } else if (eventType === "recurring.agreement-rejected.v1") {
      await handleAgreementRejected(supabase, agreementId);
    } else if (eventType === "recurring.charge-captured.v1") {
      await handleChargeCaptured(supabase, agreementId);
    } else if (eventType === "recurring.charge-failed.v1") {
      await handleChargeFailed(supabase, agreementId);
    } else {
      console.log(`Unhandled event type: ${eventType}`);
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: "Intern feil" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

async function handleAgreementActivated(
  supabase: ReturnType<typeof createClient>,
  agreementId: string
) {
  console.log(`Agreement activated: ${agreementId}`);

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .update({
      status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("vipps_agreement_id", agreementId)
    .eq("status", "pending")
    .select("id, cabin_id")
    .single();

  if (error) {
    console.error("Error activating subscription:", error);
    return;
  }

  if (subscription?.cabin_id) {
    const { error: cabinError } = await supabase
      .from("cabins")
      .update({
        is_active: true,
        subscription_id: subscription.id,
      })
      .eq("id", subscription.cabin_id);

    if (cabinError) {
      console.error("Error activating cabin:", cabinError);
    }
  }
}

async function handleAgreementStopped(
  supabase: ReturnType<typeof createClient>,
  agreementId: string
) {
  console.log(`Agreement stopped: ${agreementId}`);

  const { data: subscription } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("vipps_agreement_id", agreementId)
    .in("status", ["active", "pending"])
    .select("cabin_id, current_period_end")
    .single();

  if (subscription?.cabin_id) {
    const periodEnd = subscription.current_period_end
      ? new Date(subscription.current_period_end)
      : new Date();

    if (periodEnd <= new Date()) {
      await supabase
        .from("cabins")
        .update({ is_active: false })
        .eq("id", subscription.cabin_id);
    }
  }
}

async function handleAgreementExpired(
  supabase: ReturnType<typeof createClient>,
  agreementId: string
) {
  console.log(`Agreement expired: ${agreementId}`);

  const { data: subscription } = await supabase
    .from("subscriptions")
    .update({
      status: "expired",
      updated_at: new Date().toISOString(),
    })
    .eq("vipps_agreement_id", agreementId)
    .select("cabin_id")
    .single();

  if (subscription?.cabin_id) {
    await supabase
      .from("cabins")
      .update({ is_active: false })
      .eq("id", subscription.cabin_id);
  }
}

async function handleAgreementRejected(
  supabase: ReturnType<typeof createClient>,
  agreementId: string
) {
  console.log(`Agreement rejected: ${agreementId}`);

  const { data: subscription } = await supabase
    .from("subscriptions")
    .update({
      status: "expired",
      updated_at: new Date().toISOString(),
    })
    .eq("vipps_agreement_id", agreementId)
    .eq("status", "pending")
    .select("cabin_id")
    .single();

  if (subscription?.cabin_id) {
    await supabase
      .from("cabins")
      .update({ is_active: false })
      .eq("id", subscription.cabin_id);
  }
}

async function handleChargeCaptured(
  supabase: ReturnType<typeof createClient>,
  agreementId: string
) {
  console.log(`Charge captured for agreement: ${agreementId}`);

  const now = new Date();
  const newPeriodEnd = new Date(now);
  newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);

  await supabase
    .from("subscriptions")
    .update({
      status: "active",
      current_period_start: now.toISOString(),
      current_period_end: newPeriodEnd.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq("vipps_agreement_id", agreementId);
}

async function handleChargeFailed(
  supabase: ReturnType<typeof createClient>,
  agreementId: string
) {
  console.log(`Charge failed for agreement: ${agreementId}`);

  const { data: subscription } = await supabase
    .from("subscriptions")
    .update({
      status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("vipps_agreement_id", agreementId)
    .eq("status", "active")
    .select("cabin_id")
    .single();

  if (subscription?.cabin_id) {
    await supabase
      .from("cabins")
      .update({ is_active: false })
      .eq("id", subscription.cabin_id);
  }
}
