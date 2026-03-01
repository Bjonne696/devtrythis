import { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import supabase from "../../lib/supabaseClient";
import HelpText from "../ui/HelpText";
import {
  ModalOverlay,
  ModalBox,
  ButtonRow,
  ModalError as Error,
  Success,
  Warning,
  FormLabel,
  FormTextarea
} from '../../styles/ui/modalStyles';

export default function BookingRequestModal({ cabinId, onClose }) {
  const [session, setSession] = useState(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [loadingPendingCount, setLoadingPendingCount] = useState(true); // Start with true to prevent race

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  useEffect(() => {
    const fetchApprovedBookings = async () => {
      setLoadingBookings(true);
      setBookingsError(null);

      const { data, error } = await supabase
        .from("booking_requests")
        .select("start_date, end_date")
        .eq("cabin_id", cabinId)
        .eq("status", "approved");

      if (error) {
        setBookingsError("Kunne ikke hente bookinger. Prøv igjen senere.");
        setLoadingBookings(false);
        return;
      }

      if (data) {
        setApprovedBookings(data.map(booking => ({
          start: new Date(booking.start_date),
          end: new Date(booking.end_date)
        })));
      }
      setLoadingBookings(false);
    };

    fetchApprovedBookings();
  }, [cabinId]);

  // Hjelpefunksjon for å hente pending count
  const fetchPendingCount = async () => {
    if (!session) {
      // Ikke sett loading til false - la den forbli true til session er tilgjengelig
      return;
    }

    setLoadingPendingCount(true); // Start loading
    const { count, error } = await supabase
      .from("booking_requests")
      .select("*", { count: 'exact', head: true })
      .eq("cabin_id", cabinId)
      .eq("user_id", session.user.id)
      .eq("status", "pending");

    if (error) {
      console.error("Error fetching pending count:", error);
    } else {
      setPendingCount(count || 0);
    }
    setLoadingPendingCount(false);
  };

  // Hent antall pending requests når session er klar
  useEffect(() => {
    fetchPendingCount();
  }, [cabinId, session]);

  const checkDateOverlap = (start, end) => {
    return approvedBookings.some(booking => {
      return start <= booking.end && end >= booking.start;
    });
  };

  const handleSubmit = async () => {
    if (!session) {
      setError("Du må være logget inn for å sende en forespørsel.");
      return;
    }

    const { startDate, endDate } = dateRange[0];
    const { user } = session;

    // Sjekk om bruker har nådd limit på 2 pending requests
    if (pendingCount >= 2) {
      setError("Du har allerede 2 aktive forespørsler for denne ferieboligen. Vennligst vent på svar før du sender flere.");
      return;
    }

    if (checkDateOverlap(startDate, endDate)) {
      setError("Valgte datoer overlapper med en eksisterende booking. Vennligst velg andre datoer.");
      return;
    }

    // Sjekk om brukeren allerede har en pending forespørsel med samme datoer
    const { data: existingPending, error: pendingError } = await supabase
      .from("booking_requests")
      .select("id")
      .eq("cabin_id", cabinId)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .eq("start_date", startDate.toISOString().split("T")[0])
      .eq("end_date", endDate.toISOString().split("T")[0]);

    if (pendingError) {
      console.error("Error checking pending requests:", pendingError);
      setError("Kunne ikke sjekke eksisterende forespørsler. Prøv igjen.");
      return;
    }

    if (existingPending && existingPending.length > 0) {
      setError("Du har allerede sendt en forespørsel for disse datoene. Vennligst vent på svar fra utleier.");
      return;
    }

    setSending(true);
    setError(null);

    const { data: bookingData, error: insertError } = await supabase.from("booking_requests").insert({
      cabin_id: cabinId,
      user_id: user.id,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      message,
      status: 'pending'
    }).select().single();

    if (insertError) {
      console.error("Booking insert error:", insertError);
      
      // Sjekk om feilen er duplikat constraint (fra database unique index)
      if (insertError.code === '23505' || insertError.message?.includes('unique_pending_booking_per_user')) {
        setError("Du har allerede sendt en forespørsel for disse datoene. Vennligst vent på svar fra utleier.");
      }
      // Sjekk om feilen er pending limit (fra database trigger)
      else if (insertError.code === 'P0001' || insertError.message?.includes('maks ha 2 aktive forespørsler')) {
        setError("Du har allerede 2 aktive forespørsler for denne ferieboligen. Vennligst vent på svar før du sender flere.");
        setPendingCount(2); // Oppdater count for å reflektere faktisk state
      } else {
        setError("Kunne ikke sende forespørselen. Vennligst prøv igjen eller kontakt support hvis problemet fortsetter.");
      }
    } else {
      // Send e-post-notifikasjon til hytte-eier
      try {
        await supabase.functions.invoke('notify-owner-new-booking', {
          body: { bookingId: bookingData.id }
        });
      } catch (emailError) {
        console.error('Kunne ikke sende e-post-notifikasjon:', emailError);
        // Fortsett selv om e-post feiler
      }
      
      setSuccess(true);
      // Refetch pending count for å sikre UI er synkronisert med database
      await fetchPendingCount();
    }

    setSending(false);
  };

  return (
    <ModalOverlay>
      <ModalBox>
        <h2>Send forespørsel</h2>

        <HelpText icon="📅">
          Fyll ut datoene du ønsker å leie ferieboligen og skriv en kort melding til utleier.
          Utleier vil få beskjed og kan godkjenne eller avslå forespørselen din.
        </HelpText>

        {!loadingPendingCount && session && pendingCount > 0 && (
          <HelpText icon="⏳">
            Du har {pendingCount} aktiv{pendingCount > 1 ? 'e' : ''} forespørsel{pendingCount > 1 ? 'er' : ''} for denne ferieboligen (maks 2).
          </HelpText>
        )}

        {!session ? (
          <Warning>Du må være logget inn for å sende en forespørsel.</Warning>
        ) : bookingsError ? (
          <Error>{bookingsError}</Error>
        ) : loadingBookings ? (
          <p>Laster tilgjengelige datoer...</p>
        ) : (
          <>
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              minDate={new Date()}
              disabledDates={approvedBookings.flatMap(booking => {
                const dates = [];
                const current = new Date(booking.start);
                while (current <= booking.end) {
                  dates.push(new Date(current));
                  current.setDate(current.getDate() + 1);
                }
                return dates;
              })}
            />

            {approvedBookings.length > 0 && (
              <HelpText icon="ℹ️">
                Grå datoer er allerede opptatt og kan ikke velges.
              </HelpText>
            )}

            <FormLabel>
              Melding (valgfritt):
              <FormTextarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </FormLabel>
          </>
        )}

        {error && <Error>{error}</Error>}
        {success && <Success>Forespørselen er sendt!</Success>}

        <ButtonRow>
          <button onClick={onClose}>Lukk</button>
          <button 
            onClick={handleSubmit} 
            disabled={!session || sending || loadingBookings || loadingPendingCount || bookingsError || pendingCount >= 2}
          >
            {sending ? "Sender..." : pendingCount >= 2 ? "Maks antall forespørsler nådd" : "Send forespørsel"}
          </button>
        </ButtonRow>
      </ModalBox>
    </ModalOverlay>
  );
}