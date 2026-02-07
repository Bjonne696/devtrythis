import React, { useState } from 'react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useSubscription, cancelSubscription } from '../../hooks/useSubscription';
import {
  StatusWrapper,
  StatusHeader,
  StatusTitle,
  StatusBadge,
  StatusInfo,
  InfoItem,
  ActionButton,
  NoSubscription,
  SubText,
  WarningText
} from '../../styles/subscription/subscriptionStatusStyles';

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
          <SubText>
            Opprett en hytte for å komme i gang med abonnement.
          </SubText>
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
