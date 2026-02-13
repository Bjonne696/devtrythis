import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createSubscription, validateDiscountCode } from '../../hooks/useSubscription';
import {
  PaywallWrapper,
  PaywallTitle,
  PaywallDescription,
  PlanSelector,
  PlanCard,
  PlanName,
  PlanPrice,
  PlanFeatures,
  ActivateButton,
  ErrorMessage,
  InfoBox,
  DiscountBox,
  DiscountInput,
  ValidateButton,
  SuccessBox
} from '../../styles/subscription/subscriptionPaywallStyles';

export default function SubscriptionPaywall({ cabinId, onSuccess }) {
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [validatingCode, setValidatingCode] = useState(false);
  const [error, setError] = useState(null);

  const [discountCode, setDiscountCode] = useState('');
  const [validatedDiscount, setValidatedDiscount] = useState(null);

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
        'Detaljert statistikk',
        'Prioritert support',
        'Markedsføringstips',
      ],
    },
  };

  // Hvis brukeren endrer koden etter validering, så er den ikke lenger “bekreftet”
  useEffect(() => {
    setValidatedDiscount(null);
  }, [discountCode]);

  const normalizeCode = (code) => code.trim().toUpperCase();

  const handleValidateDiscount = async () => {
    const code = normalizeCode(discountCode);
    if (!code) return;

    setValidatingCode(true);
    setError(null);

    try {
      const result = await validateDiscountCode(code);

      if (result.valid) {
        setValidatedDiscount(result.discount);
        setError(null);
      } else {
        setError(result.error || 'Ugyldig rabattkode');
        setValidatedDiscount(null);
      }
    } finally {
      setValidatingCode(false);
    }
  };

  const handleActivate = async () => {
    setLoading(true);
    setError(null);

    try {
      const code = normalizeCode(discountCode);

      // Hvis bruker har skrevet inn kode, må den være gyldig før vi fortsetter
      if (code) {
        // Hvis ikke validert (eller mismatch), valider nå
        if (!validatedDiscount || validatedDiscount.code !== code) {
          setValidatingCode(true);

          const result = await validateDiscountCode(code);

          setValidatingCode(false);

          if (!result.valid) {
            setError(result.error || 'Ugyldig rabattkode');
            setLoading(false);
            return; // STOPP (krav)
          }

          setValidatedDiscount(result.discount);
        }
      }

      const result = await createSubscription(cabinId, selectedPlan, code ? code : null);

      // Gratis (ingen Vipps)
      if (result?.free) {
        if (typeof onSuccess === 'function') onSuccess(result);
        navigate('/min-profil', { replace: true });
        return;
      }

      // Vipps redirect
      if (result?.redirectUrl) {
        if (typeof onSuccess === 'function') onSuccess(result);
        window.location.href = result.redirectUrl;
        return;
      }

      // Fallback
      setError('Uventet respons fra server. Prøv igjen.');
      setLoading(false);
    } catch (err) {
      setError(err?.message || 'Noe gikk galt');
      setLoading(false);
      setValidatingCode(false);
    }
  };

  const buttonText = (() => {
    if (loading) return 'Behandler...';
    if (discountCode.trim()) {
      return validatingCode ? 'Validerer kode...' : 'Aktiver (bruk rabattkode)';
    }
    return `Aktiver med Vipps (${plans[selectedPlan].price} NOK/mnd)`;
  })();

  return (
    <PaywallWrapper>
      <PaywallTitle>🏔️ Aktiver din hyttelisting</PaywallTitle>
      <PaywallDescription>
        For at hytta di skal bli synlig for leietakere, trenger du et aktivt abonnement.
        Velg planen som passer best for deg:
      </PaywallDescription>

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

      <DiscountBox>
        <label>🎟️ Har du en rabattkode?</label>
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
      </DiscountBox>

      {validatedDiscount && (
        <SuccessBox>
          ✅ Rabattkode validert: <strong>{validatedDiscount.code}</strong>
        </SuccessBox>
      )}

      <InfoBox>
        💳 Betaling via Vipps MobilePay (når rabattkode ikke brukes / ikke er gyldig).
        Du kan kansellere når som helst. Ingen bindingstid.
      </InfoBox>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ActivateButton
        onClick={handleActivate}
        disabled={loading || validatingCode}
      >
        {buttonText}
      </ActivateButton>
    </PaywallWrapper>
  );
}
