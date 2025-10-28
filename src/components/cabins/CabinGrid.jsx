import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../lib/supabaseClient";
import { formatPrice } from "../../utils/formatters";
import StarRating from "../ui/StarRating";
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

export default function CabinGrid() {
  const [cabins, setCabins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCabinsWithRatings = async () => {
      setIsLoading(true);
      const { data: cabins, error: cabinsError } = await supabase
        .from('cabins')
        .select('*');

      if (cabinsError || !cabins) {
        console.error('Feil ved henting av hytter:', cabinsError?.message);
        setIsLoading(false);
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
      setIsLoading(false);
    };

    fetchCabinsWithRatings();
  }, []);

  const handleCabinClick = (cabinId) => {
    if (!cabinId) {
      console.error('Cabin ID er ugyldig:', cabinId);
      return;
    }
    try {
      navigate(`/hytte/${cabinId}`);
    } catch (error) {
      console.error('Feil ved navigering:', error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <p>Laster hytter...</p>
      </div>
    );
  }

  return (
    <div>
      <GridWrapper>
        {cabins.map((cabin) => (
          <CabinCard 
            key={cabin.id} 
            onClick={(e) => {
              e.preventDefault();
              handleCabinClick(cabin.id);
            }}
          >
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
      </GridWrapper>
    </div>
  );
}