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

      const { data, error: fetchError } = await query.order('created_at', { ascending: false }).limit(1).single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows
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

export async function createSubscription(cabinId, planType = 'basic') {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Du må være logget inn');
    }

    // Call Edge Function to create subscription
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-agreement`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cabinId, planType }),
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
