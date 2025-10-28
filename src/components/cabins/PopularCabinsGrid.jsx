
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


export default function PopularCabinsGrid() {
  const [cabins, setCabins] = useState([]);
  const navigate = useNavigate();

  const handleCabinClick = (cabinId) => {
    navigate(`/hytte/${cabinId}`);
  };

  useEffect(() => {
    const fetchPopularCabins = async () => {
      const { data: cabins, error: cabinsError } = await supabase
        .from('cabins')
        .select('*');

      if (cabinsError || !cabins) {
        console.error('Feil ved henting av hytter:', cabinsError?.message);
        return;
      }

      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('cabin_id, rating');

      if (reviewsError) {
        console.error('Feil ved henting av vurderinger:', reviewsError.message);
        setCabins([]); 
        return;
      }

      if (reviews && reviews.length > 0) {
        const ratingsMap = {};
        reviews.forEach(({ cabin_id, rating }) => {
          if (!ratingsMap[cabin_id]) ratingsMap[cabin_id] = [];
          ratingsMap[cabin_id].push(rating);
        });

        const cabinsWithAvgRating = cabins.map(cabin => {
          const ratings = ratingsMap[cabin.id] || [];
          const avg = ratings.length
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;
          const boosted = Math.min(avg + (cabin.is_premium ? 1.5 : 0), 5);
          return { ...cabin, avgRating: boosted };
        });

        const popularCabins = cabinsWithAvgRating.filter(
          (cabin) => cabin.avgRating >= 3.5
        );

        setCabins(popularCabins);
      }
    };

    fetchPopularCabins();
  }, []);

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
              {cabin.avgRating > 0 && <StarRating score={cabin.avgRating} />}
            </CabinInfo>
          </CabinCard>
        ))}
      </GridWrapper>
    </div>
  );
}
