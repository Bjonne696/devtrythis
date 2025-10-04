import React, { useState } from "react";
import supabase from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Tooltip from "../ui/Tooltip";
import HelpText from "../ui/HelpText";
import SubscriptionPaywall from "../subscription/SubscriptionPaywall";
import { useSubscription } from "../../hooks/useSubscription";
import {
  FormWrapper,
  FormField,
  Label,
  Input,
  TextArea,
  CheckboxGroup,
  SubmitButton
} from "../../styles/cabins/cabinStyles";

const facilitiesList = [
  "Kjøkken",
  "Peis", 
  "Badstue",
  "Parkering",
  "Kjæledyr tillatt",
  "WiFi",
];

export default function NewCabinForm() {
  const { user, profile } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [latitude, setLatitude] = useState(59.9139);
  const [longitude, setLongitude] = useState(10.7522);
  const [locationInfo, setLocationInfo] = useState({ address: "", postalCode: "", city: "" });
  const [files, setFiles] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [tempCabinId, setTempCabinId] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  
  const { hasActiveSubscription, loading: subLoading, refetch: refetchSubscription } = useSubscription(user?.id);
  
  const isAdmin = profile?.role === 'admin';
  const canPublish = isAdmin || hasActiveSubscription;

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = "Tittel er påkrevd";
    } else if (title.trim().length < 10) {
      newErrors.title = "Tittel må være minst 10 tegn";
    } else if (title.trim().length > 100) {
      newErrors.title = "Tittel kan ikke være mer enn 100 tegn";
    }

    if (!description.trim()) {
      newErrors.description = "Beskrivelse er påkrevd";
    } else if (description.trim().length < 50) {
      newErrors.description = "Beskrivelse må være minst 50 tegn";
    } else if (description.trim().length > 2000) {
      newErrors.description = "Beskrivelse kan ikke være mer enn 2000 tegn";
    }

    if (!price) {
      newErrors.price = "Pris er påkrevd";
    } else if (isNaN(price) || parseInt(price) < 100) {
      newErrors.price = "Pris må være minst 100 kroner";
    } else if (parseInt(price) > 10000) {
      newErrors.price = "Pris kan ikke være mer enn 10,000 kroner";
    }

    if (files.length === 0) {
      newErrors.files = "Minst ett bilde er påkrevd";
    } else if (files.length < 3) {
      newErrors.files = "Minst 3 bilder anbefales";
    } else if (files.length > 5) {
      newErrors.files = "Maksimalt 5 bilder tillatt";
    }

    if (!latitude || !longitude) {
      newErrors.location = "Du må plassere markøren på kartet";
    }

    if (facilities.length === 0) {
      newErrors.facilities = "Velg minst én fasilitet";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const reverseGeocode = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Hytteplattformen/1.0 (din@email.no)",
      },
    });
    const data = await response.json();
    if (data && data.address) {
      setLocationInfo({
        address: data.display_name || "",
        postalCode: data.address.postcode || "",
        city: data.address.city || data.address.town || data.address.village || "",
      });
    }
  };

  function DraggableMarker({ position, setPosition }) {
    useMapEvents({
      dragend: (e) => {
        const newPos = e.target.getLatLng();
        setPosition(newPos);
        reverseGeocode(newPos.lat, newPos.lng);
      },
    });
    return (
      <Marker
        draggable
        position={position}
        eventHandlers={{
          dragend: (e) => {
            const newPos = e.target.getLatLng();
            setPosition(newPos);
            reverseGeocode(newPos.lat, newPos.lng);
          },
        }}
      />
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setErrors({ submit: "Du må være logget inn" });
      return;
    }
    
    if (!validateForm()) {
      setErrors(prev => ({ ...prev, submit: "Vennligst rett opp feilene over" }));
      return;
    }
    
    setLoading(true);
    setErrors({});

    const uploadedImageUrls = [];
    for (let file of files) {
      const filePath = `cabins-images/${uuidv4()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("cabins-images").upload(filePath, file);
      if (uploadError) {
        console.error("Feil ved bildeopplasting:", uploadError.message);
        setLoading(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from("cabins-images").getPublicUrl(filePath);
      uploadedImageUrls.push(publicUrlData.publicUrl);
    }

    const fullLocation = `${locationInfo.address}, ${locationInfo.postalCode} ${locationInfo.city}`;

    const { data: cabinData, error: insertError } = await supabase
      .from("cabins")
      .insert([
        {
          owner_id: user.id,
          title,
          description,
          price_per_night: parseInt(price) * 100,
          location: fullLocation,
          latitude,
          longitude,
          facilities,
          image_urls: uploadedImageUrls,
          is_premium: isPremium,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Feil ved lagring av hytte:", insertError.message);
      setLoading(false);
      return;
    }

    setLoading(false);

    if (!canPublish) {
      setTempCabinId(cabinData.id);
      setShowPaywall(true);
      alert("Hytta er opprettet! Aktiver abonnement for å gjøre den synlig for leietakere.");
    } else {
      const successMessage = isAdmin 
        ? "Hytta er nå publisert og synlig! (Admin-konto - ingen betaling kreves)"
        : "Hytta er nå publisert og synlig!";
      alert(successMessage);
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setLatitude(59.9139);
    setLongitude(10.7522);
    setFiles([]);
    setFacilities([]);
    setIsPremium(false);
    setLocationInfo({ address: "", postalCode: "", city: "" });
    setTempCabinId(null);
    setShowPaywall(false);
  };

  const handlePaywallSuccess = async () => {
    await refetchSubscription();
    alert("Abonnement aktivert! Hytta er nå synlig for leietakere.");
    resetForm();
  };

  const handleFacilityChange = (facility) => {
    setFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  if (showPaywall && tempCabinId) {
    return (
      <FormWrapper>
        <h1>Aktiver din hyttelisting</h1>
        <SubscriptionPaywall 
          cabinId={tempCabinId} 
          onSuccess={handlePaywallSuccess}
        />
      </FormWrapper>
    );
  }

  return (
    <FormWrapper>
      <h1>Opprett ny hytteannonse</h1>
      
      {isAdmin && (
        <div style={{ 
          background: '#d4edda', 
          border: '1px solid #28a745', 
          borderRadius: '6px', 
          padding: '1rem', 
          marginBottom: '1.5rem',
          color: '#155724'
        }}>
          <strong>✓ Admin-konto:</strong> Hytta vil bli automatisk publisert uten behov for abonnement.
        </div>
      )}
      
      {!canPublish && !subLoading && (
        <div style={{ 
          background: '#fff3cd', 
          border: '1px solid #ffc107', 
          borderRadius: '6px', 
          padding: '1rem', 
          marginBottom: '1.5rem',
          color: '#856404'
        }}>
          <strong>ℹ️ Viktig:</strong> Du trenger et aktivt abonnement for at hytta skal bli synlig for leietakere. 
          Etter at du har opprettet hytta, får du mulighet til å aktivere abonnement.
        </div>
      )}
      
      <HelpText>
        <strong>Velkommen til hytteoppretting!</strong><br />
        Fyll ut alle feltene under for å lage en attraktiv annonse:
        <ul>
          <li>Skriv en beskrivende tittel og detaljert beskrivelse</li>
          <li>Last opp 3-5 bilder av høy kvalitet</li>
          <li>Plasser markøren nøyaktig på kartet</li>
          <li>Velg relevante fasiliteter for å tiltrekke riktige gjester</li>
        </ul>
      </HelpText>

      <form onSubmit={handleSubmit}>
        <FormField>
          <Tooltip text="Skriv en kort, beskrivende tittel som fanger oppmerksomheten. Eksempel: 'Koselig familiehytte ved sjøen'">
            <Label>Tittel *</Label>
          </Tooltip>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleFieldBlur('title')}
            placeholder="Eksempel: Koselig familiehytte ved sjøen"
            style={{ borderColor: touched.title && errors.title ? '#d32f2f' : '#ccc' }}
            required 
          />
          {touched.title && errors.title && (
            <p style={{ color: '#d32f2f', fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>
              {errors.title}
            </p>
          )}
        </FormField>

        <FormField>
          <Tooltip text="Beskriv hytta detaljert: beliggenhet, utsikt, aktiviteter i nærheten, spesielle egenskaper. Jo mer informasjon, jo bedre!">
            <Label>Beskrivelse *</Label>
          </Tooltip>
          <TextArea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleFieldBlur('description')}
            placeholder="Beskriv hytta, beliggenheten, aktiviteter i nærheten og spesielle egenskaper..."
            style={{ borderColor: touched.description && errors.description ? '#d32f2f' : '#ccc' }}
            required 
          />
          {touched.description && errors.description && (
            <p style={{ color: '#d32f2f', fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>
              {errors.description}
            </p>
          )}
        </FormField>

        <FormField>
          <Tooltip text="Sett en konkurransedyktig pris. Se på lignende hytter i området for å finne riktig prisnivå.">
            <Label>Pris per natt (kroner) *</Label>
          </Tooltip>
          <Input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)}
            onBlur={() => handleFieldBlur('price')}
            placeholder="1500"
            min="100"
            max="10000"
            style={{ borderColor: touched.price && errors.price ? '#d32f2f' : '#ccc' }}
            required 
          />
          {touched.price && errors.price && (
            <p style={{ color: '#d32f2f', fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>
              {errors.price}
            </p>
          )}
        </FormField>

        <FormField>
          <Tooltip text="Velg fasiliteter som finnes på hytta. Dette hjelper gjester å finne det de leter etter og øker bookingsansen.">
            <Label>Fasiliteter</Label>
          </Tooltip>
          <CheckboxGroup>
            {facilitiesList.map((facility) => (
              <label key={facility}>
                <input
                  type="checkbox"
                  checked={facilities.includes(facility)}
                  onChange={() => handleFacilityChange(facility)}
                />
                {facility}
              </label>
            ))}
          </CheckboxGroup>
        </FormField>

        <FormField>
          <Tooltip text="Last opp 3-5 bilder av høy kvalitet. Første bilde blir hovedbildet. Vis rom, utsikt og omgivelser.">
            <Label>Bilder * (3-5 bilder anbefales)</Label>
          </Tooltip>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
            required
          />
          {files.length > 0 && (
            <p style={{ color: '#4b3832', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              {files.length} bilde(r) valgt
            </p>
          )}
          {errors.files && (
            <p style={{ color: '#d32f2f', fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>
              {errors.files}
            </p>
          )}
        </FormField>

        <FormField>
          <Tooltip text="Premium annonser vises høyere i søkeresultatene og får mer oppmerksomhet. Koster ekstra, men gir bedre synlighet.">
            <Label>Premium annonse (koster mer) *</Label>
          </Tooltip>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Input
              type="checkbox"
              checked={isPremium}
              onChange={() => setIsPremium(!isPremium)}
              style={{ width: 'auto' }}
            />
            Ja, jeg vil ha premium-plassering
          </label>
        </FormField>

        {latitude && longitude && (
          <FormField>
            <Label>Plasser markør på kartet</Label>
            <MapContainer
              center={[latitude, longitude]}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <DraggableMarker
                position={{ lat: latitude, lng: longitude }}
                setPosition={(pos) => {
                  setLatitude(pos.lat);
                  setLongitude(pos.lng);
                  reverseGeocode(pos.lat, pos.lng);
                }}
              />
            </MapContainer>
            {locationInfo.address && (
              <div style={{ marginTop: "1rem" }}>
                <strong>Adresse funnet:</strong><br />
                {locationInfo.address}<br />
                {locationInfo.postalCode} {locationInfo.city}
              </div>
            )}
          </FormField>
        )}

        {errors.submit && (
          <p style={{ color: '#d32f2f', fontSize: '0.9rem', margin: '1rem 0', textAlign: 'center' }}>
            {errors.submit}
          </p>
        )}
        
        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Laster opp..." : "Publiser hytten"}
        </SubmitButton>
      </form>
    </FormWrapper>
  );
}