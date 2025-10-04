import React, { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useSubscription, cancelSubscription } from '../../hooks/useSubscription';

const StatusWrapper = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatusTitle = styled.h3`
  margin: 0;
  color: #4b3832;
`;

const StatusBadge = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.$status) {
      case 'active':
        return 'background: #d4edda; color: #155724;';
      case 'pending':
        return 'background: #fff3cd; color: #856404;';
      case 'past_due':
        return 'background: #f8d7da; color: #721c24;';
      case 'canceled':
        return 'background: #e2e3e5; color: #383d41;';
      default:
        return 'background: #e2e3e5; color: #383d41;';
    }
  }}
`;

const StatusInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  p {
    margin: 0 0 0.3rem 0;
    font-size: 0.9rem;
    color: #6c757d;
  }
  
  strong {
    font-size: 1.1rem;
    color: #4b3832;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.$variant === 'danger' ? '#dc3545' : '#667eea'};
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.$variant === 'danger' ? '#c82333' : '#5568d3'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const NoSubscription = styled.div`
  text-align: center;
  padding: 2rem;
  
  p {
    margin: 0 0 1rem 0;
    color: #6c757d;
  }
`;

const WarningText = styled.p`
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 6px;
  padding: 0.8rem;
  margin: 1rem 0;
  color: #856404;
  font-size: 0.9rem;
`;

export default function SubscriptionStatus({ userId }) {
  const { subscription, loading, refetch } = useSubscription(userId);
  const [canceling, setCanceling] = useState(false);

  if (loading) {
    return (
      <StatusWrapper>
        <p>Laster abonnementsstatus...</p>
      </StatusWrapper>
    );
  }

  if (!subscription) {
    return (
      <StatusWrapper>
        <NoSubscription>
          <p>Du har ingen aktive abonnementer.</p>
          <p style={{ fontSize: '0.9rem' }}>
            Opprett en hytte for å komme i gang med abonnement.
          </p>
        </NoSubscription>
      </StatusWrapper>
    );
  }

  const statusLabels = {
    active: 'Aktiv',
    pending: 'Ventende',
    past_due: 'Forsinket betaling',
    canceled: 'Kansellert',
  };

  const planLabels = {
    basic: 'Standard',
    premium: 'Premium',
  };

  const handleCancel = async () => {
    if (!confirm('Er du sikker på at du vil kansellere abonnementet? Hytta vil forbli aktiv til slutten av betalingsperioden.')) {
      return;
    }

    setCanceling(true);
    try {
      await cancelSubscription(subscription.id);
      alert('Abonnement kansellert. Hytta forblir aktiv til slutten av perioden.');
      refetch();
    } catch (error) {
      alert(`Feil ved kansellering: ${error.message}`);
    } finally {
      setCanceling(false);
    }
  };

  return (
    <StatusWrapper>
      <StatusHeader>
        <StatusTitle>Abonnementsstatus</StatusTitle>
        <StatusBadge $status={subscription.status}>
          {statusLabels[subscription.status] || subscription.status}
        </StatusBadge>
      </StatusHeader>

      <StatusInfo>
        <InfoItem>
          <p>Plan</p>
          <strong>{planLabels[subscription.plan_type] || subscription.plan_type}</strong>
        </InfoItem>
        <InfoItem>
          <p>Pris</p>
          <strong>{subscription.price_nok} NOK/måned</strong>
        </InfoItem>
        {subscription.current_period_end && (
          <InfoItem>
            <p>Neste fornyelse</p>
            <strong>
              {format(new Date(subscription.current_period_end), 'dd. MMMM yyyy', { locale: nb })}
            </strong>
          </InfoItem>
        )}
        <InfoItem>
          <p>Betalingsmetode</p>
          <strong>Vipps MobilePay</strong>
        </InfoItem>
      </StatusInfo>

      {subscription.status === 'past_due' && (
        <WarningText>
          ⚠️ Betalingen feilet. Hytta er satt på pause. Vennligst oppdater betalingsinformasjonen din.
        </WarningText>
      )}

      {subscription.status === 'canceled' && (
        <WarningText>
          ℹ️ Abonnementet er kansellert. Hytta forblir aktiv til {subscription.current_period_end ? format(new Date(subscription.current_period_end), 'dd. MMMM yyyy', { locale: nb }) : 'slutten av perioden'}.
        </WarningText>
      )}

      {subscription.status === 'active' && (
        <ActionButton 
          $variant="danger" 
          onClick={handleCancel}
          disabled={canceling}
        >
          {canceling ? 'Kansellerer...' : 'Kanseller abonnement'}
        </ActionButton>
      )}
    </StatusWrapper>
  );
}
