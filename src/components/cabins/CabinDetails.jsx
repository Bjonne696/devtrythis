import { useState } from "react";
import BookingRequestModal from "./BookingRequestModal";
import StarRating from "../ui/StarRating";
import { formatPrice } from '../../utils/formatters';
import {
  Details,
  RatingSection,
  RatingStars,
  BookingButton,
  FacilitiesGrid,
  FacilityItem
} from '../../styles/cabins/cabinStyles';

const getFacilityIcon = (facility) => {
  const iconMap = {
    'WiFi': '📶',
    'Parkering': '🚗',
    'Kjøkken': '🍳',
    'Bad': '🚿',
    'TV': '📺',
    'Oppvarming': '🔥',
    'Uteplass': '🏡',
    'Grill': '🔥',
    'Vaskemaskin': '🧺',
    'Oppvaskmaskin': '🍽️',
    'Jacuzzi': '🛁',
    'Sauna': '🧖',
    'Vedovn': '🪵',
    'Terrasse': '🏞️',
    'Balkong': '🏢',
    'Hage': '🌿',
    'Lekeplass': '🛝',
    'Golfbane': '⛳',
    'Ski': '🎿',
    'Sykkel': '🚴',
    'Båt': '⛵',
    'Kano': '🛶',
    'Fiske': '🎣'
  };
  return iconMap[facility] || '✨';
};

export default function CabinDetails({ cabin, averageRating }) {
  const [showModal, setShowModal] = useState(false);

  if (!cabin) return null;

  return (
    <Details>
      <p>{cabin.description || "Ingen beskrivelse."}</p>
      <p>
        <strong>Pris:</strong>{" "}
        {cabin.price_per_night != null ? `${formatPrice(cabin.price_per_night)} / natt` : "Ukjent"}
      </p>
      {averageRating > 0 && (
        <RatingSection>
          <h3>Vurdering fra gjester</h3>
          <StarRating score={averageRating} />
        </RatingSection>
      )}
      {Array.isArray(cabin.facilities) && cabin.facilities.length > 0 && (
        <div>
          <h3>Fasiliteter</h3>
          <FacilitiesGrid>
            {cabin.facilities.map((facility, index) => (
              <FacilityItem key={index}>
                <span className="facility-icon">{getFacilityIcon(facility)}</span>
                <span className="facility-name">{facility}</span>
              </FacilityItem>
            ))}
          </FacilitiesGrid>
        </div>
      )}

      <BookingButton onClick={() => setShowModal(true)}>Send forespørsel</BookingButton>

      {showModal && (
        <BookingRequestModal
          cabinId={cabin.id}
          onClose={() => setShowModal(false)}
        />
      )}
    </Details>
  );
}