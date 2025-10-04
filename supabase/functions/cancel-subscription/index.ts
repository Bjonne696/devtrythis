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

    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      throw new Error('Subscription ID is required');
    }

    // Get subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('owner_id', user.id)
      .single();

    if (subError || !subscription) {
      throw new Error('Subscription not found or unauthorized');
    }

    if (subscription.status === 'canceled') {
      throw new Error('Subscription is already canceled');
    }

    // Get payment provider config
    const { data: merchantConfig } = await supabase
      .from('merchant_settings')
      .select('settings')
      .eq('provider', 'vipps')
      .eq('is_active', true)
      .single();

    const provider = getPaymentProvider(merchantConfig?.settings || { testMode: true });

    // Cancel agreement with payment provider
    if (subscription.provider_agreement_id) {
      await provider.cancelAgreement(subscription.provider_agreement_id);
    }

    // Update subscription status to canceled
    // Note: Cabin stays active until current period ends
    await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
      })
      .eq('id', subscriptionId);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Subscription will be canceled at the end of the current period',
        currentPeriodEnd: subscription.current_period_end,
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
