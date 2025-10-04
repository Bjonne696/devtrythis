import React, { useState } from 'react';
import styled from 'styled-components';
import { createSubscription } from '../../hooks/useSubscription';

const PaywallWrapper = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin: 2rem 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const PaywallTitle = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
  font-weight: 600;
`;

const PaywallDescription = styled.p`
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.95;
`;

const PlanSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1.5rem 0;
`;

const PlanCard = styled.div`
  background: ${props => props.$selected ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${props => props.$selected ? 'white' : 'transparent'};
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const PlanName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
`;

const PlanPrice = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin: 0.5rem 0;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
  
  li {
    padding: 0.3rem 0;
    &:before {
      content: "✓ ";
      font-weight: bold;
    }
  }
`;

const ActivateButton = styled.button`
  background: white;
  color: #667eea;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 0, 0, 0.2);
  border: 1px solid rgba(255, 0, 0, 0.4);
  color: white;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
`;

const InfoBox = styled.div`
  background: rgba(255, 255, 255, 0.15);
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  font-size: 0.95rem;
`;

const DiscountBox = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
`;

const DiscountInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  color: #4b3832;
  text-transform: uppercase;
  
  &:focus {
    outline: none;
    border-color: white;
  }
`;

const ValidateButton = styled.button`
  background: rgba(255, 255, 255, 0.3);
  color: white;
  border: 2px solid white;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: white;
    color: #667eea;
  }
`;

const SuccessBox = styled.div`
  background: rgba(40, 167, 69, 0.3);
  border: 2px solid #28a745;
  color: white;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  font-weight: 500;
`;

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
            <PlanPrice>{plan.price} NOK<span style={{ fontSize: '1rem', fontWeight: 'normal' }}>/mnd</span></PlanPrice>
            <PlanFeatures>
              {plan.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </PlanFeatures>
          </PlanCard>
        ))}
      </PlanSelector>

      <DiscountBox>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
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
