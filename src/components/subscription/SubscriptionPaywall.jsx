import React, { useState } from 'react';
import { createSubscription } from '../../hooks/useSubscription';
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

  const handleValidateDiscount = () => {
    const mockCodes = [
      {
        code: 'SUMMER2025',
        duration_months: 2,
        valid_until: '2025-12-31',
        is_active: true,
      }
    ];

    const code = mockCodes.find(c => 
      c.code === discountCode.toUpperCase() && 
      c.is_active && 
      new Date(c.valid_until) >= new Date()
    );

    if (code) {
      setValidatedDiscount(code);
      setError(null);
    } else {
      setError('Ugyldig eller utløpt rabattkode');
      setValidatedDiscount(null);
    }
  };

  const handleActivate = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await createSubscription(cabinId, selectedPlan, validatedDiscount?.code);
      
      // For mock provider, the redirect URL is local
      if (result.redirectUrl.startsWith('/')) {
        // Mock payment - auto approve after short delay
        setTimeout(() => {
          alert('Abonnement aktivert! (Test-modus)');
          if (onSuccess) onSuccess();
        }, 1000);
      } else {
        // Real Vipps - redirect to payment page
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
          disabled={!discountCode}
        >
          Valider kode
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
        {loading ? 'Aktiverer...' : validatedDiscount 
          ? `Aktiver med ${validatedDiscount.duration_months} måned${validatedDiscount.duration_months > 1 ? 'er' : ''} gratis` 
          : `Aktiver med Vipps (${plans[selectedPlan].price} NOK/mnd)`
        }
      </ActivateButton>
    </PaywallWrapper>
  );
}
