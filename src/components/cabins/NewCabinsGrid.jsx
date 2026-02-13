import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../lib/supabaseClient";
import { formatPrice } from "../../utils/formatters";
import StarRating from "../ui/StarRating";
import CreateListingCard from "./CreateListingCard";
import {
  GridWrapper,
  CabinCard,
  CabinImage,
  CabinInfo,
  CabinTitle,
  CabinLocation,
  CabinPrice,
  RatingStars
} from '../../styles/cabins/cabinStyles';
import { NoResults } from '../../styles/layout/pageStyles';

export default function NewCabinsGrid() {
  const [cabins, setCabins] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleCabinClick = (cabinId) => {
    navigate(`/hytte/${cabinId}`);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    const fetchNewCabins = async () => {
      const { data: cabins, error: cabinsError } = await supabase
        .from('cabins')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(12);


      if (cabinsError || !cabins) {
        console.error('Feil ved henting av nye hytter:', cabinsError?.message);
        return;
      }

      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('cabin_id, rating');

      const ratingsMap = {};

      if (!reviewsError && reviews) {
        reviews.forEach(({ cabin_id, rating }) => {
          if (!ratingsMap[cabin_id]) ratingsMap[cabin_id] = [];
          ratingsMap[cabin_id].push(rating);
        });
      }

      const enriched = cabins.map(cabin => {
        const ratings = ratingsMap[cabin.id] || [];
        const avg = ratings.length
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;
        const boosted = Math.min(avg + (cabin.is_premium ? 1.5 : 0), 5);
        return { ...cabin, average_score: boosted };
      });

      setCabins(enriched);
    };

    fetchNewCabins();
  }, []);

  if (cabins.length === 0) {
    return (
      <div>
        <NoResults>Ingen nye hytter tilgjengelig for øyeblikket.</NoResults>
        <GridWrapper $centered>
          <CreateListingCard isLoggedIn={!!user} />
        </GridWrapper>
      </div>
    );
  }

  return (
    <div>
      <GridWrapper>
        {cabins.map((cabin) => (
          <CabinCard key={cabin.id} onClick={() => handleCabinClick(cabin.id)}>
            {cabin.image_urls && cabin.image_urls.length > 0 && (
              <CabinImage src={cabin.image_urls[0]} alt={cabin.title} />
            )}
            <CabinInfo>
              <CabinTitle>{cabin.title}</CabinTitle>
              <CabinLocation>{cabin.location}</CabinLocation>
              <CabinPrice>{formatPrice(cabin.price_per_night)} / natt</CabinPrice>
              {cabin.average_score > 0 && <StarRating score={cabin.average_score} />}
            </CabinInfo>
          </CabinCard>
        ))}
        {cabins.length < 12 && <CreateListingCard isLoggedIn={!!user} />}
      </GridWrapper>
    </div>
  );
}