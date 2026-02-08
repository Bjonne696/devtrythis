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

    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return new Response(
        JSON.stringify({ error: "subscriptionId er påkrevd" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: subscription, error: subError } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("id", subscriptionId)
      .eq("owner_id", user.id)
      .single();

    if (subError || !subscription) {
      return new Response(
        JSON.stringify({ error: "Abonnement ikke funnet" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (subscription.status !== "active") {
      return new Response(
        JSON.stringify({ error: "Abonnementet er ikke aktivt" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (subscription.vipps_agreement_id) {
      const accessToken = await getVippsAccessToken();

      const patchResponse = await fetch(
        `${VIPPS_API_URL}/recurring/v3/agreements/${subscription.vipps_agreement_id}`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Ocp-Apim-Subscription-Key": VIPPS_SUBSCRIPTION_KEY,
            "Merchant-Serial-Number": VIPPS_MSN,
            "Content-Type": "application/json",
            "Idempotency-Key": crypto.randomUUID(),
          },
          body: JSON.stringify({
            status: "STOPPED",
          }),
        }
      );

      if (!patchResponse.ok) {
        const errorData = await patchResponse.text();
        console.error("Vipps cancel error:", errorData);
        return new Response(
          JSON.stringify({ error: "Kunne ikke kansellere hos Vipps. Prøv igjen." }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const { error: updateError } = await supabaseClient
      .from("subscriptions")
      .update({
        status: "canceled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscriptionId);

    if (updateError) {
      console.error("Error updating subscription:", updateError);
      return new Response(
        JSON.stringify({ error: "Kunne ikke oppdatere abonnement" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Abonnement kansellert. Hytta forblir aktiv til slutten av perioden.",
        currentPeriodEnd: subscription.current_period_end,
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
