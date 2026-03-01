import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import supabase from "../../lib/supabaseClient";
import { formatPrice } from "../../utils/formatters";
import { cancelSubscription, createSubscription } from "../../hooks/useSubscription";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  ListingsGrid,
  ListingCard,
  ListingImage,
  ListingImagePlaceholder,
  ListingBody,
  ListingHeader,
  ListingTitle,
  ListingLocation,
  ListingPrice,
  SubscriptionBadge,
  SubscriptionInfo,
  SubscriptionDetail,
  ButtonGroup,
  ListingButton,
  EmptyListings,
  LoadingText,
  ConfirmOverlay,
  ConfirmDialog,
  ConfirmButtons,
  ActionMessage
} from "../../styles/profile/myListingsStyles";

const statusLabels = {
  active: 'Aktiv',
  pending: 'Ventende',
  past_due: 'Forsinket',
  canceled: 'Kansellert',
};

export default function MyCabinsWithSubscription() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchListings = async () => {
    if (!profile?.id) return;

    setLoading(true);
    try {
      const { data: cabins, error: cabinsError } = await supabase
        .from("cabins")
        .select("id, title, location, image_urls, is_active, is_premium, price_per_night")
        .eq("owner_id", profile.id)
        .order("created_at", { ascending: false });

      if (cabinsError) {
        console.error("Feil ved henting av hytter:", cabinsError.message);
        setLoading(false);
        return;
      }

      const { data: subscriptions, error: subsError } = await supabase
        .from("subscriptions")
        .select("id, cabin_id, status, plan_type, price_nok, current_period_end, discount_code, vipps_agreement_id")
        .eq("owner_id", profile.id)
        .order("created_at", { ascending: false });

      if (subsError) {
        console.error("Feil ved henting av abonnementer:", subsError.message);
      }

      const subsMap = {};
      if (subscriptions) {
        for (const sub of subscriptions) {
          if (!subsMap[sub.cabin_id]) {
            subsMap[sub.cabin_id] = sub;
          }
        }
      }

      const combined = (cabins || []).map(cabin => ({
        ...cabin,
        subscription: subsMap[cabin.id] || null,
      }));

      setListings(combined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [profile?.id]);

  const showMessage = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 5000);
  };

  const handleCancel = async (subscription) => {
    setConfirmAction({
      title: 'Kanseller abonnement',
      message: 'Er du sikker på at du vil kansellere abonnementet? Hytta vil forbli aktiv til slutten av perioden.',
      onConfirm: async () => {
        setConfirmAction(null);
        setActionLoading(subscription.id);
        try {
          await cancelSubscription(subscription.id);
          showMessage('success', 'Abonnement kansellert.');
          await fetchListings();
        } catch (e) {
          showMessage('error', `Feil ved kansellering: ${e.message}`);
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  const handleReactivate = async (cabin, subscription) => {
    setActionLoading(cabin.id);
    try {
      const res = await createSubscription(cabin.id, subscription?.plan_type || 'basic', null);
      if (res?.free) {
        showMessage('success', 'Abonnement reaktivert.');
        await fetchListings();
        return;
      }
      if (res?.redirectUrl) {
        window.location.href = res.redirectUrl;
        return;
      }
      await fetchListings();
    } catch (e) {
      showMessage('error', `Feil ved reaktivering: ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivate = async (cabin) => {
    setActionLoading(cabin.id);
    try {
      const res = await createSubscription(cabin.id, 'basic', null);
      if (res?.free) {
        showMessage('success', 'Abonnement aktivert.');
        await fetchListings();
        return;
      }
      if (res?.redirectUrl) {
        window.location.href = res.redirectUrl;
        return;
      }
      await fetchListings();
    } catch (e) {
      showMessage('error', `Feil ved aktivering: ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <LoadingText>Laster annonser...</LoadingText>;
  }

  if (!profile) return null;

  if (listings.length === 0) {
    return (
      <EmptyListings>
        <p>Du har ingen hytteannonser enda.</p>
        <ListingButton $variant="view" onClick={() => navigate('/ny-hytte')}>
          Opprett ny hytte
        </ListingButton>
      </EmptyListings>
    );
  }

  return (
    <>
      {confirmAction && (
        <ConfirmOverlay onClick={() => setConfirmAction(null)}>
          <ConfirmDialog onClick={(e) => e.stopPropagation()}>
            <h4>{confirmAction.title}</h4>
            <p>{confirmAction.message}</p>
            <ConfirmButtons>
              <ListingButton $variant="danger" onClick={confirmAction.onConfirm}>
                Bekreft
              </ListingButton>
              <ListingButton $variant="view" onClick={() => setConfirmAction(null)}>
                Avbryt
              </ListingButton>
            </ConfirmButtons>
          </ConfirmDialog>
        </ConfirmOverlay>
      )}

      {actionMessage && (
        <ActionMessage $type={actionMessage.type}>
          {actionMessage.text}
        </ActionMessage>
      )}

      <ListingsGrid>
        {listings.map((listing) => {
          const sub = listing.subscription;
          const subStatus = sub?.status || null;
          const isProcessing = actionLoading === listing.id || actionLoading === sub?.id;

          return (
            <ListingCard key={listing.id}>
              {listing.image_urls?.[0] ? (
                <ListingImage src={listing.image_urls[0]} alt={listing.title} />
              ) : (
                <ListingImagePlaceholder>Ingen bilde</ListingImagePlaceholder>
              )}

              <ListingBody>
                <ListingHeader>
                  <ListingTitle>{listing.title}</ListingTitle>
                  {subStatus ? (
                    <SubscriptionBadge $status={subStatus}>
                      {statusLabels[subStatus] || subStatus}
                    </SubscriptionBadge>
                  ) : (
                    <SubscriptionBadge $status="none">Ingen abb.</SubscriptionBadge>
                  )}
                </ListingHeader>

                <ListingLocation>{listing.location}</ListingLocation>
                <ListingPrice>{formatPrice(listing.price_per_night)} / natt</ListingPrice>

                {sub && (
                  <SubscriptionInfo>
                    <SubscriptionDetail>
                      Plan: {sub.plan_type === 'premium' ? 'Premium' : 'Standard'}
                    </SubscriptionDetail>
                    {sub.price_nok !== undefined && (
                      <SubscriptionDetail>
                        {sub.price_nok} NOK/mnd
                      </SubscriptionDetail>
                    )}
                    {sub.current_period_end && (
                      <SubscriptionDetail>
                        Fornyes: {format(new Date(sub.current_period_end), "dd.MM.yyyy", { locale: nb })}
                      </SubscriptionDetail>
                    )}
                    {sub.discount_code && (
                      <SubscriptionDetail>
                        Rabattkode: {sub.discount_code}
                      </SubscriptionDetail>
                    )}
                  </SubscriptionInfo>
                )}

                <ButtonGroup>
                  <ListingButton
                    $variant="view"
                    onClick={() => navigate(`/hytte/${listing.id}`)}
                  >
                    Se hytte
                  </ListingButton>

                  {subStatus === 'active' && (
                    <ListingButton
                      $variant="danger"
                      onClick={() => handleCancel(sub)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Kansellerer...' : 'Kanseller'}
                    </ListingButton>
                  )}

                  {(subStatus === 'canceled' || subStatus === 'past_due') && (
                    <ListingButton
                      $variant="activate"
                      onClick={() => handleReactivate(listing, sub)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Aktiverer...' : 'Aktiver på nytt'}
                    </ListingButton>
                  )}

                  {!subStatus && (
                    <ListingButton
                      $variant="activate"
                      onClick={() => handleActivate(listing)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Aktiverer...' : 'Aktiver'}
                    </ListingButton>
                  )}

                </ButtonGroup>
              </ListingBody>
            </ListingCard>
          );
        })}
      </ListingsGrid>
    </>
  );
}
