
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapWrapper, GoogleMapsLink } from "../../styles/cabins/cabinStyles";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const openGoogleMaps = (lat, lng, title) => {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(title)}`;
  window.open(googleMapsUrl, '_blank');
};

export default function CabinMap({ title, lat, lng, cabins = [] }) {
  // Hvis vi har en enkelt hytte
  if (title && lat != null && lng != null) {
    return (
      <MapWrapper>
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "300px", width: "100%" }}
          eventHandlers={{
            click: () => openGoogleMaps(lat, lng, title)
          }}
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[lat, lng]}>
            <Popup>{title}</Popup>
          </Marker>
        </MapContainer>
        <GoogleMapsLink onClick={() => openGoogleMaps(lat, lng, title)}>
          📍 Åpne i Google Maps
        </GoogleMapsLink>
      </MapWrapper>
    );
  }

  // Hvis vi har flere hytter
  if (cabins && cabins.length > 0) {
    const validCabins = cabins.filter(cabin => 
      cabin.latitude != null && cabin.longitude != null
    );

    if (validCabins.length === 0) {
      return <p>Ingen hytter med gyldig posisjon funnet.</p>;
    }

    // Beregn senterpunkt basert på alle hyttenes posisjoner
    const centerLat = validCabins.reduce((sum, cabin) => sum + cabin.latitude, 0) / validCabins.length;
    const centerLng = validCabins.reduce((sum, cabin) => sum + cabin.longitude, 0) / validCabins.length;

    return (
      <MapWrapper>
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={10}
          scrollWheelZoom={true}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {validCabins.map((cabin) => (
            <Marker 
              key={cabin.id} 
              position={[cabin.latitude, cabin.longitude]}
            >
              <Popup>
                <div>
                  <strong>{cabin.title}</strong><br />
                  {cabin.price_per_night && (
                    <span>Kr {(cabin.price_per_night / 100).toLocaleString()}/natt</span>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </MapWrapper>
    );
  }

  return <p>Kartposisjon er ikke tilgjengelig.</p>;
}
