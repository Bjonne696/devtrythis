import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
import {
  RequestBox,
  ButtonRow,
  RequestInfo,
  RequestMessage,
  LoadingText,
  NoRequestsText
} from "../../styles/bookings/bookingStyles";

export default function OwnerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setRequests([]);
        setLoading(false);
        return;
      }

      const userId = user.id;

      const { data: cabins, error: cabinsError } = await supabase
        .from("cabins")
        .select("id, title")
        .eq("owner_id", userId);

      if (cabinsError || !cabins || cabins.length === 0) {
        setRequests([]);
        setLoading(false);
        return;
      }

      const cabinIds = cabins.map(c => c.id);
      const cabinMap = Object.fromEntries(cabins.map(c => [c.id, c.title]));

      const { data: bookings, error: bookingsError } = await supabase
        .from("booking_requests")
        .select("id, cabin_id, user_id, start_date, end_date, message, status, created_at")
        .in("cabin_id", cabinIds)
        .eq("status", "pending");

      if (bookingsError || !bookings) {
        setRequests([]);
        setLoading(false);
        return;
      }

      const userIds = [...new Set(bookings.map(b => b.user_id))];
      const { data: users, error: usersError } = await supabase
        .from("profiles")
        .select("id, name, last_name, email")
        .in("id", userIds);

      const userMap = Object.fromEntries(
        users.map(u => [u.id, { name: `${u.name ?? ""} ${u.last_name ?? ""}`.trim(), email: u.email }])
      );

      const enriched = bookings.map(b => ({
        ...b,
        requester_name: userMap[b.user_id]?.name || "-",
        requester_email: userMap[b.user_id]?.email || "-",
        cabin_title: cabinMap[b.cabin_id] || "(Ukjent hytte)"
      }));

      setRequests(enriched);
      setLoading(false);
    };

    fetchRequests();
  }, []);

  const handleUpdate = async (id, status) => {
    const { error } = await supabase
      .from("booking_requests")
      .update({ status: status })
      .eq("id", id);

    if (!error) {
      // Send e-post-notifikasjon til den som sendte forespørselen
      try {
        await supabase.functions.invoke('notify-booking-status', {
          body: { bookingId: id, status }
        });
      } catch (emailError) {
        console.error('Kunne ikke sende e-post-notifikasjon:', emailError);
        // Fortsett selv om e-post feiler
      }
      
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert("Feil ved oppdatering av status");
    }
  };

  const handleReject = async (id) => {
    const { error } = await supabase
      .from("booking_requests")
      .update({ status: "rejected" })
      .eq("id", id);

    if (!error) {
      // Send e-post-notifikasjon til den som sendte forespørselen
      try {
        await supabase.functions.invoke('notify-booking-status', {
          body: { bookingId: id, status: 'rejected' }
        });
      } catch (emailError) {
        console.error('Kunne ikke sende e-post-notifikasjon:', emailError);
        // Fortsett selv om e-post feiler
      }
      
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert("Feil ved avslag av forespørsel");
    }
  };

  if (loading) return <LoadingText>Laster forespørsler...</LoadingText>;
  if (requests.length === 0) return <NoRequestsText>Ingen nye forespørsler.</NoRequestsText>;

  return (
    <div>
      {requests.map((req) => (
        <RequestBox key={req.id}>
          <RequestInfo>
            <strong>{req.requester_name}</strong> ({req.requester_email}) ønsker å leie hytten <strong>"{req.cabin_title}"</strong><br />
            fra <strong>{req.start_date}</strong> til <strong>{req.end_date}</strong>
          </RequestInfo>
          {req.message && <RequestMessage><em>Melding:</em> {req.message}</RequestMessage>}
          <ButtonRow>
            <button className="approve" onClick={() => handleUpdate(req.id, "approved")}>Godkjenn</button>
            <button className="reject" onClick={() => handleReject(req.id)}>Avslå</button>
          </ButtonRow>
        </RequestBox>
      ))}
    </div>
  );
}