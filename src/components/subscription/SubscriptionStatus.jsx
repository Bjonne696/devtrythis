import React, { useState } from 'react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useSubscriptionsList, cancelSubscription } from '../../hooks/useSubscription';
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
  const { subscriptions, loading, refetch } = useSubscriptionsList(userId);
  const [canceling, setCanceling] = useState(false);

  if (loading) {
    return (
      <StatusWrapper>
        <p>Laster abonnementsstatus...</p>
      </StatusWrapper>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <StatusWrapper>
        <StatusHeader>
          <StatusTitle>Abonnementsstatus</StatusTitle>
          <StatusBadge $status="none">Ingen abonnement</StatusBadge>
        </StatusHeader>
        <StatusText>
          Du har ingen abonnement ennå.
        </StatusText>
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
    <div style={{ display: 'grid', gap: '16px' }}>
      {subscriptions.map((subscription) => (
        <StatusWrapper key={subscription.id}>
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
              <p>Betaling</p>
              <strong>{subscription.discount_code ? 'Rabattkode (gratis)' : 'Vipps MobilePay'}</strong>
            </InfoItem>
          </StatusInfo>

          {(subscription.status === 'active') && (
            <ActionButton
              $variant="danger"
              onClick={async () => {
                if (!confirm('Er du sikker på at du vil kansellere abonnementet?')) return;
                setCanceling(true);
                try {
                  await cancelSubscription(subscription.id);
                  alert('Abonnement kansellert.');
                  refetch();
                } catch (e) {
                  alert(`Feil ved kansellering: ${e.message}`);
                } finally {
                  setCanceling(false);
                }
              }}
              disabled={canceling}
            >
              {canceling ? 'Kansellerer...' : 'Kanseller abonnement'}
            </ActionButton>
          )}
        </StatusWrapper>
      ))}
    </div>
  );

