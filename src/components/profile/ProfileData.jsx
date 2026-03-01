import React, { useEffect, useRef, useState } from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import supabase from "../../lib/supabaseClient";
import AvatarUploader from "./AvatarUploader";
import OwnerRequests from "../bookings/OwnerRequests";
import AddReviewForm from "../reviews/AddReviewForm";
import MyCabinsWithSubscription from "./MyCabinsWithSubscription";
import { useUpcomingRentals } from "../../hooks/useUpcomingRentals";
import {
  ProfileWrapper,
  TopSection,
  LeftSide,
  RightSide,
  MiddleSection,
  Box,
  StyledCard,
  ActionButton,
  SaveButton,
  CabinImage,
  PlaceholderImage,
  ProfileImage,
  ProfileRow,
  ReviewListContainer,
  ReviewCard,
  OwnerInfoText,
  ContactLink,
  ViewCabinButton,
  ReviewStatusText,
  DeleteReviewButton
} from "../../styles/profile/profileStyles";
import { MainWrapper, Heading, ProfileSection, SectionHeading, SectionContent, PollingNotice, PollingButton } from "../../styles/pages/minProfilPageStyles";

const POLL_INTERVAL_MS = 1000;
const POLL_MAX = 20;

export default function ProfileData() {
  const { profile, user } = useAuth();
  const location = useLocation();
  const [refreshKey, setRefreshKey] = useState(0);
  const [pollingPhase, setPollingPhase] = useState(null);
  const pollCount = useRef(0);
  const intervalRef = useRef(null);

  const startPolling = () => {
    if (intervalRef.current) return;
    pollCount.current = 0;
    setPollingPhase('polling');

    intervalRef.current = setInterval(async () => {
      pollCount.current += 1;
      try {
        const { data } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('owner_id', user.id)
          .eq('status', 'active')
          .limit(1);

        if (data && data.length > 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setPollingPhase(null);
          setRefreshKey((k) => k + 1);
          return;
        }
      } catch {
      }

      if (pollCount.current >= POLL_MAX) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setPollingPhase('timeout');
      }
    }, POLL_INTERVAL_MS);
  };

  const handleManualRefresh = () => {
    setPollingPhase(null);
    setRefreshKey((k) => k + 1);
  };

  useEffect(() => {
    if (location.state?.vippsCallback === 'success') {
      setRefreshKey((k) => k + 1);
      startPolling();
    } else if (location.state?.justActivated) {
      setRefreshKey((k) => k + 1);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [location.state]);
  
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [incomingReviews, setIncomingReviews] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);

  const navigate = useNavigate();
  const { rentals: upcomingRentals, loading: loadingRentals } = useUpcomingRentals(user?.id);

  const fetchProfile = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      if (data.avatar_url) {
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(data.avatar_url);
        setAvatarUrl(urlData.publicUrl);
      } else {
        setAvatarUrl(null);
      }
    }
  };

  const fetchPastBookings = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from("booking_requests")
      .select(`id, start_date, end_date, cabins (id, title, location, image_urls, owner_id)`)
      .eq("user_id", user.id)
      .eq("status", "approved")
      .lt("end_date", today)
      .order("end_date", { ascending: false });

    if (!error) {
      setPastBookings(data || []);
    }
  };

  const fetchUserReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("cabin_id")
      .eq("user_id", user.id);

    if (!error && data) {
      setReviews(data.map((r) => r.cabin_id));
    }
  };

  const fetchIncomingReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("rating, comment, cabin_id, cabins(title, owner_id)")
      .eq("cabins.owner_id", user.id);

    if (!error && data) {
      setIncomingReviews(data);
    }
  };

  const handleDeleteReview = async (cabinId) => {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("user_id", user.id)
      .eq("cabin_id", cabinId);

    if (error) {
      console.error("Feil ved sletting:", error.message);
    } else {
      fetchUserReviews();
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchPastBookings();
      fetchUserReviews();
      fetchIncomingReviews();
    }
  }, [user?.id]);

  if (!profile) return <p>Laster profil...</p>;

  const isOwner = user?.id === profile.id;

  return (
    <ProfileWrapper>
      <TopSection>
        <LeftSide>
          {avatarUrl ? (
            <ProfileImage src={avatarUrl} alt="Profilbilde" />
          ) : (
            <PlaceholderImage />
          )}
          <ProfileRow>
            <strong>Navn:</strong>{" "}
            {`${profile.name ?? ""} ${profile.last_name ?? ""}`.trim() || "-"}
          </ProfileRow>
          <ProfileRow>
            <strong>Område:</strong> {profile.region || "-"}
          </ProfileRow>
        </LeftSide>
        <RightSide>
          {isOwner && <AvatarUploader onUpload={fetchProfile} />}
          <ActionButton onClick={() => navigate("/ny-hytte")}>Ny hytte</ActionButton>
        </RightSide>
      </TopSection>

      <MiddleSection>
        <Box>
          <h3>Review</h3>
          {incomingReviews.length === 0 ? (
            <p>Ingen vurderinger på dine hytter ennå.</p>
          ) : (
            <ReviewListContainer>
              {incomingReviews
                .filter((rev) => rev.cabins?.owner_id === user?.id)
                .map((rev, index) => (
                  <ReviewCard key={index}>
                    <p>
                      <strong>{rev.cabins?.title}</strong><br />
                      Score: {rev.rating} ⭐<br />
                      Kommentar: {rev.comment}
                    </p>
                  </ReviewCard>
                ))
              }
            </ReviewListContainer>
          )}
        </Box>
      </MiddleSection>

      <ProfileSection>
        <SectionHeading>Mine annonser og abonnement</SectionHeading>

        {pollingPhase === 'polling' && (
          <PollingNotice>
            <span>Venter på bekreftelse fra Vipps… Henter status automatisk.</span>
          </PollingNotice>
        )}

        {pollingPhase === 'timeout' && (
          <PollingNotice>
            <span>Det tok lengre tid enn ventet. Sjekk gjerne igjen om litt.</span>
            <PollingButton onClick={handleManualRefresh}>Oppdater</PollingButton>
          </PollingNotice>
        )}

        <SectionContent>
          <MyCabinsWithSubscription key={`listings-${refreshKey}`} />
        </SectionContent>
      </ProfileSection>

      <ProfileSection>
        <SectionHeading>Innkommende forespørsler</SectionHeading>
        <SectionContent>
          <OwnerRequests />
        </SectionContent>
      </ProfileSection>

      <ProfileSection>
        <SectionHeading>Fremtidige leieforhold</SectionHeading>
        <SectionContent>
          {loadingRentals ? (
            <p>Laster...</p>
          ) : upcomingRentals.length > 0 ? (
            upcomingRentals.map((rental) => (
              <StyledCard key={rental.id}>
                <h4>{rental.cabins?.title || "Hytte uten navn"}</h4>
                <p>
                  {new Date(rental.start_date).toLocaleDateString()} –{" "}
                  {new Date(rental.end_date).toLocaleDateString()}
                </p>
                <p>{rental.cabins?.location}</p>
                {rental.cabins?.price_per_night && (
                  <p>Pris per natt: {rental.cabins.price_per_night} kr</p>
                )}

                {rental.cabins?.image_urls?.[0] && (
                  <CabinImage
                    src={rental.cabins.image_urls[0]}
                    alt="Hyttebilde"
                  />
                )}

                {rental.cabins?.profiles && (
                  <OwnerInfoText>
                    Eier: {rental.cabins.profiles.name} {rental.cabins.profiles.last_name}
                    {rental.cabins.profiles.email && (
                      <> • <ContactLink href={`mailto:${rental.cabins.profiles.email}`}>
                        Kontakt eier
                      </ContactLink></>
                    )}
                  </OwnerInfoText>
                )}

                <ViewCabinButton 
                  onClick={() => navigate(`/hytte/${rental.cabins.id}`)}
                >
                  Se hytteside
                </ViewCabinButton>
              </StyledCard>
            ))
          ) : (
            <p>Ingen fremtidige leieforhold funnet.</p>
          )}
        </SectionContent>
      </ProfileSection>

      <ProfileSection>
        <SectionHeading>Tidligere leid</SectionHeading>
        <SectionContent>
          {pastBookings.length > 0 ? (
            pastBookings.map((booking) => (
              <StyledCard key={booking.id}>
                <h4>{booking.cabins?.title || "Hytte uten navn"}</h4>
                <p>
                  {new Date(booking.start_date).toLocaleDateString()} –{" "}
                  {new Date(booking.end_date).toLocaleDateString()}
                </p>
                <p>{booking.cabins?.location}</p>

                {booking.cabins?.image_urls?.[0] && (
                  <CabinImage
                    src={booking.cabins.image_urls[0]}
                    alt="Hyttebilde"
                  />
                )}

                {reviews.includes(booking.cabins.id) ? (
                  <>
                    <ReviewStatusText>
                      Du har allerede vurdert denne hytta.
                    </ReviewStatusText>
                    <DeleteReviewButton
                      onClick={() => handleDeleteReview(booking.cabins.id)}
                    >
                      Slett vurdering
                    </DeleteReviewButton>
                  </>
                ) : (
                  <AddReviewForm
                    cabinId={booking.cabins.id}
                    userId={user.id}
                    onReviewSubmitted={fetchUserReviews}
                  />
                )}
              </StyledCard>
            ))
          ) : (
            <p>Ingen tidligere leieforhold funnet.</p>
          )}
        </SectionContent>
      </ProfileSection>
    </ProfileWrapper>
  );
}