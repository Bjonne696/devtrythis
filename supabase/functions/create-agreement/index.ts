import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createServiceClient } from '../_shared/supabase-client.ts';
import { getPaymentProvider } from '../_shared/payment-provider.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createServiceClient();
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { cabinId, planType = 'basic' } = await req.json();

    if (!cabinId) {
      throw new Error('Cabin ID is required');
    }

    // Check if cabin belongs to user
    const { data: cabin, error: cabinError } = await supabase
      .from('cabins')
      .select('id, owner_id, title')
      .eq('id', cabinId)
      .eq('owner_id', user.id)
      .single();

    if (cabinError || !cabin) {
      throw new Error('Cabin not found or unauthorized');
    }

    // Check if subscription already exists for this cabin
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('id, status')
      .eq('cabin_id', cabinId)
      .in('status', ['active', 'pending'])
      .single();

    if (existingSub) {
      return new Response(
        JSON.stringify({ 
          error: 'Subscription already exists for this cabin',
          subscriptionId: existingSub.id,
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get payment provider config
    const { data: merchantConfig } = await supabase
      .from('merchant_settings')
      .select('settings')
      .eq('provider', 'vipps')
      .eq('is_active', true)
      .single();

    const provider = getPaymentProvider(merchantConfig?.settings || { testMode: true });

    // Determine price based on plan
    const priceNok = planType === 'premium' ? 149 : 99;

    // Create agreement with payment provider
    const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/webhook-payments`;
    
    const { agreementId, redirectUrl } = await provider.createAgreement({
      userId: user.id,
      planType,
      priceNok,
      callbackUrl,
    });

    // Create subscription record
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        owner_id: user.id,
        cabin_id: cabinId,
        status: 'pending',
        plan_type: planType,
        price_nok: priceNok,
        payment_provider: 'vipps',
        provider_agreement_id: agreementId,
      })
      .select()
      .single();

    if (subError) {
      throw new Error(`Failed to create subscription: ${subError.message}`);
    }

    return new Response(
      JSON.stringify({
        subscriptionId: subscription.id,
        redirectUrl,
        agreementId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
