import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import supabase from "../../lib/supabaseClient";
import MyCabins from "../cabins/MyCabins";
import AvatarUploader from "./AvatarUploader";
import OwnerRequests from "../bookings/OwnerRequests";
import AddReviewForm from "../reviews/AddReviewForm";
import SubscriptionStatus from "../subscription/SubscriptionStatus";
import { useUpcomingRentals } from "../../hooks/useUpcomingRentals";
import {
  ProfileWrapper,
  TopSection,
  LeftSide,
  RightSide,
  MiddleSection,
  Box,
  StyledCard,
  Textarea,
  ActionButton,
  SaveButton,
  CabinImage,
  PlaceholderImage,
  ProfileImage,
  ProfileRow
} from "../../styles/profile/profileStyles";
import { MainWrapper, Heading, ProfileSection, SectionHeading, SectionContent } from "../../styles/pages/minProfilPageStyles";



export default function ProfileData() {
  const { profile, user } = useAuth();
  const [about, setAbout] = useState("");
  const [editAbout, setEditAbout] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [incomingReviews, setIncomingReviews] = useState([]);
  const [userCabins, setUserCabins] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);

  const navigate = useNavigate();
  const { rentals: upcomingRentals, loading: loadingRentals } = useUpcomingRentals(user?.id);

  const fetchProfile = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("about, avatar_url")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setAbout(data.about || "");
      setEditAbout(data.about || "");
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

  const fetchUserCabins = async () => {
    const { data, error } = await supabase
      .from("cabins")
      .select("id, title, location, image_urls")
      .eq("owner_id", user.id);

    if (!error) {
      setUserCabins(data);
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
      fetchUserCabins();
    }
  }, [user?.id]);

  const handleSaveAbout = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ about: editAbout })
      .eq("id", profile.id);

    if (!error) {
      setAbout(editAbout);
      setIsEditing(false);
    }
  };

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
          <h3>Om</h3>
          {isEditing ? (
            <>
              <Textarea
                value={editAbout}
                onChange={(e) => setEditAbout(e.target.value)}
              />
              <SaveButton onClick={handleSaveAbout}>Lagre</SaveButton>
            </>
          ) : (
            <>
              <p>{about || "Ingen beskrivelse lagt til ennå."}</p>
              {isOwner && (
                <SaveButton onClick={() => setIsEditing(true)}>Rediger</SaveButton>
              )}
            </>
          )}
        </Box>
        <Box>
          <h3>Review</h3>
          {incomingReviews.length === 0 ? (
            <p>Ingen vurderinger på dine hytter ennå.</p>
          ) : (
            <div style={{
              maxHeight: "300px",
              overflowY: "auto",
              padding: "0.5rem",
              border: "1px solid #e0e0e0",
              borderRadius: "0.5rem",
              backgroundColor: "#f9f9f9"
            }}>
              {incomingReviews
                .filter((rev) => rev.cabins?.owner_id === user?.id)
                .map((rev, index) => (
                  <div key={index} style={{
                    marginBottom: "1rem",
                    padding: "1rem",
                    backgroundColor: "white",
                    borderRadius: "0.5rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                  }}>
                    <p>
                      <strong>{rev.cabins?.title}</strong><br />
                      Score: {rev.rating} ⭐<br />
                      Kommentar: {rev.comment}
                    </p>
                  </div>
                ))
              }
            </div>
          )}
        </Box>
      </MiddleSection>

      {isOwner && (
        <ProfileSection>
          <SectionHeading>Abonnement</SectionHeading>
          <SectionContent>
            <SubscriptionStatus userId={user?.id} />
          </SectionContent>
        </ProfileSection>
      )}

      <ProfileSection>
        <SectionHeading>Mine annonser</SectionHeading>
        <SectionContent>
          <MyCabins />
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
                  <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
                    Eier: {rental.cabins.profiles.name} {rental.cabins.profiles.last_name}
                    {rental.cabins.profiles.email && (
                      <> • <a href={`mailto:${rental.cabins.profiles.email}`} style={{ color: "#2b6cb0" }}>
                        Kontakt eier
                      </a></>
                    )}
                  </p>
                )}

                <ActionButton 
                  onClick={() => navigate(`/hytte/${rental.cabins.id}`)}
                  style={{ marginTop: "1rem" }}
                >
                  Se hytteside
                </ActionButton>
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
                    <p style={{ color: "green", marginTop: "0.5rem" }}>
                      Du har allerede vurdert denne hytta.
                    </p>
                    <SaveButton
                      onClick={() => handleDeleteReview(booking.cabins.id)}
                      style={{ backgroundColor: "#e53e3e" }}
                    >
                      Slett vurdering
                    </SaveButton>
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