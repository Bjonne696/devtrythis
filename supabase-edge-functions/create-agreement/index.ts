import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const VIPPS_API_URL = "https://api.vipps.no";
const VIPPS_CLIENT_ID = Deno.env.get("VIPPS_CLIENT_ID")!;
const VIPPS_CLIENT_SECRET = Deno.env.get("VIPPS_CLIENT_SECRET")!;
const VIPPS_SUBSCRIPTION_KEY = Deno.env.get("VIPPS_SUBSCRIPTION_KEY")!;
const VIPPS_MSN = Deno.env.get("VIPPS_MSN")!;

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const PLAN_PRICES: Record<string, number> = {
  basic: 99,
  premium: 149,
};

async function getVippsAccessToken(): Promise<string> {
  const response = await fetch(`${VIPPS_API_URL}/accesstoken/get`, {
    method: "POST",
    headers: {
      "client_id": VIPPS_CLIENT_ID,
      "client_secret": VIPPS_CLIENT_SECRET,
      "Ocp-Apim-Subscription-Key": VIPPS_SUBSCRIPTION_KEY,
      "Merchant-Serial-Number": VIPPS_MSN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Vipps access token error:", errorText);
    throw new Error("Kunne ikke hente Vipps access token");
  }

  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Mangler autorisasjon" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Ugyldig bruker" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { cabinId, planType, discountCode } = await req.json();

    if (!cabinId || !planType) {
      return new Response(
        JSON.stringify({ error: "cabinId og planType er påkrevd" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const priceNok = PLAN_PRICES[planType];
    if (!priceNok) {
      return new Response(
        JSON.stringify({ error: "Ugyldig plantype" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: cabin, error: cabinError } = await supabaseClient
      .from("cabins")
      .select("id, owner_id")
      .eq("id", cabinId)
      .single();

    if (cabinError || !cabin) {
      return new Response(
        JSON.stringify({ error: "Hytte ikke funnet" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (cabin.owner_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "Du eier ikke denne hytta" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: existingSub } = await supabaseClient
      .from("subscriptions")
      .select("id, status")
      .eq("cabin_id", cabinId)
      .eq("owner_id", user.id)
      .in("status", ["active", "pending"])
      .maybeSingle();

    if (existingSub) {
      return new Response(
        JSON.stringify({ error: "Du har allerede et aktivt eller ventende abonnement for denne hytta" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let campaignConfig = null;
    if (discountCode) {
      const { data: discount, error: discountError } = await supabaseClient
        .from("discount_codes")
        .select("*")
        .eq("code", discountCode.toUpperCase())
        .eq("is_active", true)
        .gte("valid_until", new Date().toISOString().split("T")[0])
        .single();

      if (discountError || !discount) {
        return new Response(
          JSON.stringify({ error: "Ugyldig eller utløpt rabattkode" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (discount.max_uses !== null) {
        const { count } = await supabaseClient
          .from("subscriptions")
          .select("id", { count: "exact", head: true })
          .eq("discount_code", discountCode.toUpperCase());

        if (count !== null && count >= discount.max_uses) {
          return new Response(
            JSON.stringify({ error: "Rabattkoden er brukt opp" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      campaignConfig = {
        type: "PERIOD" as const,
        price: 0,
        currency: "NOK",
        period: {
          unit: "MONTH" as const,
          count: discount.duration_months,
        },
      };
    }

    const priceOre = priceNok * 100;

    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("phone")
      .eq("id", user.id)
      .single();

    const accessToken = await getVippsAccessToken();

    const siteUrl = Deno.env.get("SITE_URL") || "https://berge-hyttene.no";
    const idempotencyKey = crypto.randomUUID();

    const agreementBody: Record<string, unknown> = {
      pricing: {
        type: "LEGACY",
        amount: priceOre,
        currency: "NOK",
      },
      interval: {
        unit: "MONTH",
        count: 1,
      },
      merchantRedirectUrl: `${siteUrl}/vipps/callback`,
      merchantAgreementUrl: `${siteUrl}/min-profil`,
      productName: `Berge Hyttene - ${planType === "premium" ? "Premium" : "Standard"}`,
      productDescription: `Månedlig abonnement for hytteutleie (${priceNok} kr/mnd)`,
      ...(profile?.phone ? { phoneNumber: profile.phone.replace(/\s/g, "").replace("+47", "") } : {}),
    };

    if (campaignConfig) {
      agreementBody.campaign = campaignConfig;
    }

    const vippsResponse = await fetch(`${VIPPS_API_URL}/recurring/v3/agreements`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Ocp-Apim-Subscription-Key": VIPPS_SUBSCRIPTION_KEY,
        "Merchant-Serial-Number": VIPPS_MSN,
        "Idempotency-Key": idempotencyKey,
        "Content-Type": "application/json",
        "Vipps-System-Name": "berge-hyttene",
        "Vipps-System-Version": "1.0.0",
      },
      body: JSON.stringify(agreementBody),
    });

    if (!vippsResponse.ok) {
      const errorData = await vippsResponse.text();
      console.error("Vipps create agreement error:", errorData);
      return new Response(
        JSON.stringify({ error: "Kunne ikke opprette Vipps-avtale. Prøv igjen." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const vippsData = await vippsResponse.json();
    const { agreementId, vippsConfirmationUrl } = vippsData;

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const { error: subError } = await supabaseClient
      .from("subscriptions")
      .insert({
        owner_id: user.id,
        cabin_id: cabinId,
        plan_type: planType,
        status: "pending",
        price_nok: priceNok,
        vipps_agreement_id: agreementId,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        ...(discountCode ? { discount_code: discountCode.toUpperCase() } : {}),
      });

    if (subError) {
      console.error("Subscription insert error:", subError);
      return new Response(
        JSON.stringify({ error: "Kunne ikke lagre abonnement" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        redirectUrl: vippsConfirmationUrl,
        agreementId: agreementId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "En uventet feil oppstod" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
