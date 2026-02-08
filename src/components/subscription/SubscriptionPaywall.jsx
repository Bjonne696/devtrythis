import React, { useState } from 'react';
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

  const handleValidateDiscount = async () => {
    if (!discountCode.trim()) return;

    setValidatingCode(true);
    setError(null);

    const result = await validateDiscountCode(discountCode);

    if (result.valid) {
      setValidatedDiscount(result.discount);
      setError(null);
    } else {
      setError(result.error);
      setValidatedDiscount(null);
    }

    setValidatingCode(false);
  };

  const handleActivate = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await createSubscription(cabinId, selectedPlan, validatedDiscount?.code);
      
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

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
        <label>
          🎟️ Har du en rabattkode?
        </label>
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
          disabled={!discountCode || validatingCode}
        >
          {validatingCode ? 'Validerer...' : 'Valider kode'}
        </ValidateButton>
      </DiscountBox>

      {validatedDiscount && (
        <SuccessBox>
          ✅ Rabattkode aktivert! Du får <strong>{validatedDiscount.duration_months} måned{validatedDiscount.duration_months > 1 ? 'er' : ''} gratis</strong> 🎉
        </SuccessBox>
      )}

      <InfoBox>
        💳 Betaling via Vipps MobilePay. Du kan kansellere når som helst. 
        Ingen bindingstid.
      </InfoBox>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ActivateButton onClick={handleActivate} disabled={loading}>
        {loading ? 'Sender deg til Vipps...' : validatedDiscount 
          ? `Aktiver med ${validatedDiscount.duration_months} måned${validatedDiscount.duration_months > 1 ? 'er' : ''} gratis` 
          : `Aktiver med Vipps (${plans[selectedPlan].price} NOK/mnd)`
        }
      </ActivateButton>
    </PaywallWrapper>
  );
}
