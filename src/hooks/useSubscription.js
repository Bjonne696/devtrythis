import { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';

export function useSubscription(userId, cabinId = null) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchSubscription();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('subscription_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `owner_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setSubscription(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, cabinId]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('subscriptions')
        .select('*')
        .eq('owner_id', userId)
        .in('status', ['active', 'pending', 'past_due']);

      if (cabinId) {
        query = query.eq('cabin_id', cabinId);
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false }).limit(1).maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      setSubscription(data || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveSubscription = subscription?.status === 'active';
  const hasPendingSubscription = subscription?.status === 'pending';

  return {
    subscription,
    hasActiveSubscription,
    hasPendingSubscription,
    loading,
    error,
    refetch: fetchSubscription,
  };
}

export function useSubscriptionsList(userId) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('id, status, plan_type, price_nok, current_period_end, cabin_id, created_at, vipps_agreement_id, discount_code')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setSubscriptions(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setSubscriptions([]);
      return;
    }

    fetchSubscriptions();

    const channel = supabase
      .channel('subscription_list_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `owner_id=eq.${userId}`,
        },
        () => {
          fetchSubscriptions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    subscriptions,
    loading,
    error,
    refetch: fetchSubscriptions,
  };
}

export async function createSubscription(cabinId, planType = 'basic', discountCode = null) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Du må være logget inn');
    }

    const body = { cabinId, planType };
    if (discountCode) {
      body.discountCode = discountCode;
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-agreement`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Kunne ikke opprette abonnement');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

export async function validateDiscountCode(code) {
  try {
    const { data, error } = await supabase
      .from('discount_codes')
      .select('code, duration_months, valid_until, is_active, max_uses')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .gte('valid_until', new Date().toISOString().split('T')[0])
      .single();

    if (error || !data) {
      return { valid: false, error: 'Ugyldig eller utløpt rabattkode' };
    }

    if (data.max_uses !== null) {
      const { count } = await supabase
        .from('subscriptions')
        .select('id', { count: 'exact', head: true })
        .eq('discount_code', code.toUpperCase());

      if (count !== null && count >= data.max_uses) {
        return { valid: false, error: 'Rabattkoden er brukt opp' };
      }
    }

    return {
      valid: true,
      discount: {
        code: data.code,
        duration_months: data.duration_months,
        valid_until: data.valid_until,
        is_active: data.is_active,
      },
    };
  } catch (error) {
    console.error('Error validating discount code:', error);
    return { valid: false, error: 'Kunne ikke validere rabattkode' };
  }
}

export async function cancelSubscription(subscriptionId) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Du må være logget inn');
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cancel-subscription`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Kunne ikke kansellere abonnement');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}
