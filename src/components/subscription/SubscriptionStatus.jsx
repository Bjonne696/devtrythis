import React, { useState } from 'react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useSubscriptionsList, cancelSubscription, createSubscription, deleteSubscription } from '../../hooks/useSubscription';
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
        <SubText>
          Du har ingen abonnement ennå.
        </SubText>
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

            {subscription.current_period_start && (
              <InfoItem>
                <p>Periode start</p>
                <strong>
                  {format(new Date(subscription.current_period_start), "dd. MMMM yyyy", { locale: nb })}
                </strong>
              </InfoItem>
            )}

            {subscription.current_period_end && (
              <InfoItem>
                <p>Periode slutt</p>
                <strong>
                  {format(new Date(subscription.current_period_end), "dd. MMMM yyyy", { locale: nb })}
                </strong>
              </InfoItem>
            )}

            {subscription.free_until && (
              <InfoItem>
                <p>Gratis til</p>
                <strong>
                  {format(new Date(subscription.free_until), "dd. MMMM yyyy", { locale: nb })}
                </strong>
              </InfoItem>
            )}

            {subscription.next_charge_at && (
              <InfoItem>
                <p>Neste belastning</p>
                <strong>
                  {format(new Date(subscription.next_charge_at), "dd. MMMM yyyy", { locale: nb })}
                </strong>
              </InfoItem>
            )}

            
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
          {(subscription.status === 'canceled' || subscription.status === 'past_due') && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <ActionButton
                onClick={async () => {
                  try {
                    const res = await createSubscription(subscription.cabin_id, subscription.plan_type, null);

                    if (res?.free) {
                      refetch();
                      return;
                    }

                    if (res?.redirectUrl) {
                      window.location.href = res.redirectUrl;
                      return;
                    }

                    refetch();
                  } catch (e) {
                    alert(`Feil ved reaktivering: ${e.message}`);
                  }
                }}
              >
                Aktiver på nytt
              </ActionButton>

              <ActionButton
                $variant="danger"
                onClick={async () => {
                  if (!confirm('Slette abonnementet? Dette sletter også hytta.')) return;

                  try {
                    await deleteSubscription(subscription.cabin_id);
                    refetch();
                  } catch (e) {
                    alert(`Feil ved sletting: ${e.message}`);
                  }
                }}
              >
                Slett abonnement
              </ActionButton>
            </div>
          )}
        </StatusWrapper>
      ))}
    </div>
  );
}
}