import { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';

export function useUpcomingRentals(userId) {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setRentals([]);
      setLoading(false);
      return;
    }

    const fetchUpcomingRentals = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];

        const { data, error: fetchError } = await supabase
          .from('booking_requests')
          .select(`
            id,
            start_date,
            end_date,
            created_at,
            cabins (
              id,
              title,
              location,
              image_urls,
              price_per_night,
              owner_id,
              profiles:owner_id (
                id,
                name,
                last_name,
                email
              )
            )
          `)
          .eq('user_id', userId)
          .eq('status', 'approved')
          .gte('start_date', today)
          .order('start_date', { ascending: true });

        if (fetchError) {
          setError(fetchError);
          setRentals([]);
        } else {
          setRentals(data || []);
        }
      } catch (err) {
        console.error('Error fetching upcoming rentals:', err);
        setError(err);
        setRentals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingRentals();
  }, [userId]);

  return { rentals, loading, error };
}
