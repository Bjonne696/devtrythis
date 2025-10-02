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

    if (checkDateOverlap(startDate, endDate)) {
      setError("Valgte datoer overlapper med en eksisterende booking. Vennligst velg andre datoer.");
      return;
    }

    setSending(true);
    setError(null);

    const { user } = session;

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
      setError("Kunne ikke sende forespørselen. Vennligst prøv igjen eller kontakt support hvis problemet fortsetter.");
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
    }

    setSending(false);
  };

  return (
    <ModalOverlay>
      <ModalBox>
        <h2>Send forespørsel</h2>

        <HelpText icon="📅">
          Fyll ut datoene du ønsker å leie hytta og skriv en kort melding til utleier.
          Utleier vil få beskjed og kan godkjenne eller avslå forespørselen din.
        </HelpText>

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
          <button onClick={handleSubmit} disabled={!session || sending || loadingBookings || bookingsError}>
            {sending ? "Sender..." : "Send forespørsel"}
          </button>
        </ButtonRow>
      </ModalBox>
    </ModalOverlay>
  );
}