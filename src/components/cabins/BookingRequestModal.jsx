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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  const handleSubmit = async () => {
    if (!session) {
      setError("Du må være logget inn for å sende en forespørsel.");
      return;
    }

    setSending(true);
    setError(null);

    const { startDate, endDate } = dateRange[0];
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
      setError("Kunne ikke sende forespørselen. Prøv igjen.");
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
        ) : (
          <>
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
            />

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
          <button onClick={handleSubmit} disabled={!session || sending}>
            {sending ? "Sender..." : "Send forespørsel"}
          </button>
        </ButtonRow>
      </ModalBox>
    </ModalOverlay>
  );
}