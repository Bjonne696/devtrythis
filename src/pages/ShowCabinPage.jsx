import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import { getPublicUrl } from "../lib/storage";
import "leaflet/dist/leaflet.css";
import LogoHeader from "../components/nav/LogoHeader";
import Header from "../components/nav/Header";
import CabinImages from "../components/cabins/CabinImages";
import CabinDetails from "../components/cabins/CabinDetails";
import CabinOwner from "../components/cabins/CabinOwner";
import CabinMap from "../components/cabins/CabinMap";
import Footer from "../components/nav/Footer";
import { PageWrapper, MainContent, RatingSection, RatingStars } from "../styles/pages/showCabinPageStyles";
import StarRating from "../components/ui/StarRating";


export default function ShowCabinPage() {
  const { id } = useParams();
  const [cabin, setCabin] = useState(null);
  const [owner, setOwner] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchCabin = async () => {
      const { data, error } = await supabase
        .from("cabins")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Cabin fetch error:", error);
        return;
      }

      if (data) {
        setCabin(data);

        // Fetch owner data
        const { data: ownerData, error: ownerError } = await supabase
          .from("profiles")
          .select("name, last_name, avatar_url, region")
          .eq("id", data.owner_id)
          .maybeSingle();

        if (ownerError) {
          console.error("Owner fetch error:", ownerError);
        } else if (ownerData) {
          setOwner(ownerData);
        } else {
          // Set a default owner if profile doesn't exist
          setOwner({
            name: "Ukjent",
            last_name: "Eier",
            avatar_url: null,
            region: "Ikke spesifisert"
          });
        }

        // Fetch ratings for this cabin
        const { data: reviews, error: reviewsError } = await supabase
          .from("reviews")
          .select("rating")
          .eq("cabin_id", id);

        if (!reviewsError && reviews && reviews.length > 0) {
          const avg = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
          const boosted = Math.min(avg + (data.is_premium ? 1.5 : 0), 5);
          setAverageRating(boosted);
        }
      }
    };

    fetchCabin();
  }, [id]);

  if (!cabin || !owner) return <p>Laster hytteinfo...</p>;

  const avatarSrc = getPublicUrl("avatars", owner.avatar_url);

  return (
    <PageWrapper>
      <LogoHeader />
      <Header />
      <MainContent>
        <h1>{cabin.title || "Uten tittel"}</h1>
        <CabinImages imageUrls={cabin.image_urls} />
        <CabinDetails cabin={cabin} averageRating={averageRating} />
        <CabinOwner owner={owner} cabinLocation={cabin.location} />
        <CabinMap title={cabin.title} lat={cabin.latitude} lng={cabin.longitude} />
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}