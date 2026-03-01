import React, { useState, useEffect } from "react";
import supabase from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Tooltip from "../ui/Tooltip";
import HelpText from "../ui/HelpText";
import { createSubscription, validateDiscountCode } from "../../hooks/useSubscription";
import {
  FormWrapper,
  FormField,
  Label,
  Input,
  TextArea,
  CheckboxGroup,
  SubmitButton
} from "../../styles/cabins/cabinStyles";
import {
  AdminAlert,
  WarningAlert,
  ErrorText,
  FileInfo,
  MapWrapper,
  SubmitError,
  CheckboxLabel,
  AddressRow,
  GeoSearchButton,
  GeoSearchError
} from "../../styles/cabins/newCabinFormStyles";
import {
  SubscriptionSection,
  SectionTitle,
  PlanSelector,
  PlanCard,
  PlanName,
  PlanPrice,
  PlanFeatures,
  DiscountSection,
  DiscountInput,
  ValidateButton,
  DiscountSuccess,
  DiscountError,
  InfoBox,
  SubmitMessage
} from "../../styles/cabins/newCabinSubscriptionStyles";

const facilitiesList = [
  "Kjøkken",
  "Peis",
  "Badstue",
  "Parkering",
  "Kjæledyr tillatt",
  "WiFi",
];

const plans = {
  basic: {
    name: 'Standard',
    price: 99,
    features: [
      'Hytte synlig for leietakere',
      'Grunnleggende statistikk',
      'E-post varsling',
      'Ubegrenset antall bookinger',
    ],
  },
  premium: {
    name: 'Premium',
    price: 149,
    features: [
      'Alt i Standard',
      'Fremhevet plassering',
      'Prioritert support',
    ],
  },
};

function MapController({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}

export default function NewCabinForm() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [latitude, setLatitude] = useState(59.9139);
  const [longitude, setLongitude] = useState(10.7522);
  const [locationInfo, setLocationInfo] = useState({ address: "", postalCode: "", city: "" });
  const [files, setFiles] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [discountCode, setDiscountCode] = useState('');
  const [validatedDiscount, setValidatedDiscount] = useState(null);
  const [validatingCode, setValidatingCode] = useState(false);
  const [discountError, setDiscountError] = useState(null);
  const [submitMessage, setSubmitMessage] = useState(null);

  const [geocodeLoading, setGeocodeLoading] = useState(false);
  const [geocodeError, setGeocodeError] = useState(null);

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    setValidatedDiscount(null);
    setDiscountError(null);
  }, [discountCode]);

  const normalizeCode = (code) => code.trim().toUpperCase();

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

  const handleForwardGeocode = async () => {
    const query = [locationInfo.address, locationInfo.postalCode, locationInfo.city]
      .filter(Boolean)
      .join(' ');

    if (!query.trim()) {
      setGeocodeError('Skriv inn en adresse for å søke.');
      return;
    }

    setGeocodeLoading(true);
    setGeocodeError(null);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Hytteplattformen/1.0 (din@email.no)' },
      });
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setLatitude(parseFloat(lat));
        setLongitude(parseFloat(lon));
        setLocationInfo(prev => ({ ...prev, address: display_name }));
      } else {
        setGeocodeError('Ingen treff. Prøv med mer detaljert adresse, postnummer eller by.');
      }
    } catch {
      setGeocodeError('Feil ved adressesøk. Sjekk nettforbindelsen og prøv igjen.');
    } finally {
      setGeocodeLoading(false);
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

  const handleValidateDiscount = async () => {
    const code = normalizeCode(discountCode);
    if (!code) return;

    setValidatingCode(true);
    setDiscountError(null);

    try {
      const result = await validateDiscountCode(code);
      if (result.valid) {
        setValidatedDiscount(result.discount);
        setDiscountError(null);
      } else {
        setDiscountError(result.error || 'Ugyldig rabattkode');
        setValidatedDiscount(null);
      }
    } finally {
      setValidatingCode(false);
    }
  };

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
    setSubmitMessage(null);

    const code = normalizeCode(discountCode);

    if (!isAdmin && code) {
      const result = await validateDiscountCode(code);
      if (!result.valid) {
        setDiscountError(result.error || 'Ugyldig rabattkode');
        setLoading(false);
        return;
      }
      setValidatedDiscount(result.discount);
    }

    try {
      const uploadedImageUrls = [];
      for (let file of files) {
        const filePath = `cabins-images/${uuidv4()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from("cabins-images").upload(filePath, file);
        if (uploadError) {
          setSubmitMessage({ type: 'error', text: `Feil ved bildeopplasting: ${uploadError.message}` });
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
            is_premium: selectedPlan === 'premium',
          },
        ])
        .select()
        .single();

      if (insertError) {
        setSubmitMessage({ type: 'error', text: `Feil ved lagring av hytte: ${insertError.message}` });
        setLoading(false);
        return;
      }

      if (isAdmin) {
        setSubmitMessage({ type: 'success', text: 'Hytta er publisert! (Admin-konto – ingen betaling kreves)' });
        setTimeout(() => {
          navigate('/min-profil', { replace: true, state: { justActivated: true } });
        }, 1500);
        return;
      }

      const subResult = await createSubscription(cabinData.id, selectedPlan, code || null);

      if (subResult?.free) {
        navigate('/min-profil', { replace: true, state: { justActivated: true } });
        return;
      }

      if (subResult?.redirectUrl) {
        window.location.href = subResult.redirectUrl;
        return;
      }

      setSubmitMessage({ type: 'error', text: 'Uventet respons fra server. Prøv igjen.' });
      setLoading(false);
    } catch (err) {
      setSubmitMessage({ type: 'error', text: err?.message || 'Noe gikk galt ved opprettelse.' });
      setLoading(false);
    }
  };

  const handleFacilityChange = (facility) => {
    setFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const buttonText = (() => {
    if (loading) return 'Oppretter...';
    if (isAdmin) return 'Publiser hytten (admin)';
    if (discountCode.trim() && validatedDiscount) {
      return 'Opprett hytte (bruk rabattkode)';
    }
    return `Opprett hytte og betal med Vipps (${plans[selectedPlan].price} NOK/mnd)`;
  })();

  return (
    <FormWrapper>
      <h1>Opprett ny hytteannonse</h1>

      {isAdmin && (
        <AdminAlert>
          <strong>Admin-konto:</strong> Hytta vil bli automatisk publisert uten behov for abonnement.
        </AdminAlert>
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
            $hasError={touched.title && errors.title}
            required
          />
          {touched.title && errors.title && (
            <ErrorText>{errors.title}</ErrorText>
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
            $hasError={touched.description && errors.description}
            required
          />
          {touched.description && errors.description && (
            <ErrorText>{errors.description}</ErrorText>
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
            $hasError={touched.price && errors.price}
            required
          />
          {touched.price && errors.price && (
            <ErrorText>{errors.price}</ErrorText>
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
            <FileInfo>{files.length} bilde(r) valgt</FileInfo>
          )}
          {errors.files && (
            <ErrorText>{errors.files}</ErrorText>
          )}
        </FormField>

        <FormField>
          <Label>Søk etter adresse</Label>
          <AddressRow>
            <input
              type="text"
              placeholder="Adresse (f.eks. Storgata 1)"
              value={locationInfo.address}
              onChange={(e) =>
                setLocationInfo((prev) => ({ ...prev, address: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Postnummer"
              value={locationInfo.postalCode}
              onChange={(e) =>
                setLocationInfo((prev) => ({ ...prev, postalCode: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="By / sted"
              value={locationInfo.city}
              onChange={(e) =>
                setLocationInfo((prev) => ({ ...prev, city: e.target.value }))
              }
            />
            <GeoSearchButton
              type="button"
              onClick={handleForwardGeocode}
              disabled={geocodeLoading}
            >
              {geocodeLoading ? 'Søker...' : 'Finn på kart'}
            </GeoSearchButton>
          </AddressRow>
          {geocodeError && <GeoSearchError>{geocodeError}</GeoSearchError>}
        </FormField>

        {latitude && longitude && (
          <FormField>
            <Label>Plasser markør nøyaktig på kartet</Label>
            <MapContainer
              center={[latitude, longitude]}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapController lat={latitude} lng={longitude} />
              <DraggableMarker
                position={{ lat: latitude, lng: longitude }}
                setPosition={(pos) => {
                  setLatitude(pos.lat);
                  setLongitude(pos.lng);
                  reverseGeocode(pos.lat, pos.lng);
                }}
              />
            </MapContainer>
          </FormField>
        )}

        {!isAdmin && (
          <SubscriptionSection>
            <SectionTitle>Velg abonnementsplan</SectionTitle>
            <PlanSelector>
              {Object.entries(plans).map(([key, plan]) => (
                <PlanCard
                  key={key}
                  $selected={selectedPlan === key}
                  onClick={() => setSelectedPlan(key)}
                >
                  <PlanName>{plan.name}</PlanName>
                  <PlanPrice>{plan.price} NOK /mnd</PlanPrice>
                  <PlanFeatures>
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </PlanFeatures>
                </PlanCard>
              ))}
            </PlanSelector>

            <DiscountSection>
              <label>Har du en rabattkode?</label>
              <DiscountInput
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Skriv inn rabattkode"
                maxLength={20}
              />
              <ValidateButton
                type="button"
                onClick={handleValidateDiscount}
                disabled={!discountCode.trim() || validatingCode || loading}
              >
                {validatingCode ? 'Validerer...' : 'Valider kode'}
              </ValidateButton>
              {validatedDiscount && (
                <DiscountSuccess>
                  Rabattkode validert: <strong>{validatedDiscount.code}</strong>
                </DiscountSuccess>
              )}
              {discountError && (
                <DiscountError>{discountError}</DiscountError>
              )}
            </DiscountSection>

            <InfoBox>
              Betaling skjer via Vipps MobilePay (når rabattkode ikke brukes).
              Du kan kansellere når som helst. Ingen bindingstid.
            </InfoBox>
          </SubscriptionSection>
        )}

        {submitMessage && (
          <SubmitMessage $type={submitMessage.type}>
            {submitMessage.text}
          </SubmitMessage>
        )}

        {errors.submit && (
          <SubmitError>{errors.submit}</SubmitError>
        )}

        <SubmitButton type="submit" disabled={loading || validatingCode}>
          {buttonText}
        </SubmitButton>
      </form>
    </FormWrapper>
  );
}
