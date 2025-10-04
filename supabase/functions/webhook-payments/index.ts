import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createServiceClient } from '../_shared/supabase-client.ts';

serve(async (req) => {
  try {
    const supabase = createServiceClient();
    
    // Parse webhook payload
    const payload = await req.json();
    const signature = req.headers.get('X-Vipps-Signature') || '';

    // TODO: Verify webhook signature in production
    // const provider = getPaymentProvider(config);
    // if (!provider.verifyWebhookSignature(JSON.stringify(payload), signature)) {
    //   throw new Error('Invalid webhook signature');
    // }

    const { agreementId, status, eventType } = payload;

    // Check for duplicate webhook (idempotency)
    const { data: existingEvent } = await supabase
      .from('payment_events')
      .select('id')
      .eq('provider_event_id', payload.eventId || `${agreementId}_${Date.now()}`)
      .single();

    if (existingEvent) {
      console.log('Duplicate webhook event, skipping');
      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find subscription by agreement ID
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('provider_agreement_id', agreementId)
      .single();

    if (subError || !subscription) {
      throw new Error('Subscription not found');
    }

    // Log payment event
    await supabase.from('payment_events').insert({
      subscription_id: subscription.id,
      event_type: eventType || 'webhook_received',
      provider_event_id: payload.eventId || `${agreementId}_${Date.now()}`,
      payload: payload,
    });

    // Update subscription status based on webhook
    let newStatus = subscription.status;
    let updateCabin = false;

    switch (eventType || status) {
      case 'AGREEMENT_ACTIVATED':
      case 'CHARGE_SUCCESS':
        newStatus = 'active';
        updateCabin = true;
        break;
      case 'CHARGE_FAILED':
        newStatus = 'past_due';
        updateCabin = true;
        break;
      case 'AGREEMENT_STOPPED':
      case 'AGREEMENT_EXPIRED':
        newStatus = 'canceled';
        updateCabin = true;
        break;
    }

    // Update subscription
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    await supabase
      .from('subscriptions')
      .update({
        status: newStatus,
        current_period_start: newStatus === 'active' ? now.toISOString() : subscription.current_period_start,
        current_period_end: newStatus === 'active' ? periodEnd.toISOString() : subscription.current_period_end,
      })
      .eq('id', subscription.id);

    // Update cabin active status
    if (updateCabin && subscription.cabin_id) {
      await supabase
        .from('cabins')
        .update({
          is_active: newStatus === 'active',
          subscription_id: subscription.id,
        })
        .eq('id', subscription.cabin_id);
    }

    return new Response(
      JSON.stringify({ 
        received: true, 
        subscriptionStatus: newStatus 
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
