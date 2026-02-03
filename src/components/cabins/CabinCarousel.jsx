import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import supabase from '../../lib/supabaseClient';
import { formatPrice } from '../../utils/formatters';
import StarRating from "../ui/StarRating";
import {
  CarouselWrapper,
  CarouselInner,
  CarouselCabinCard,
  CarouselImage,
  CarouselInfo,
  CarouselTitle,
  CarouselLocation,
  CarouselPrice,
  PrevButton,
  NextButton
} from "../../styles/cabins/cabinStyles";

export default function CabinCarousel() {
  const [cabins, setCabins] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCabinsWithRatings = async () => {
      const { data: cabins, error: cabinsError } = await supabase
        .from('cabins')
        .select('*')
        .eq('is_premium', true)
        .limit(20);

      if (cabinsError || !cabins) {
        console.error('Feil ved henting av hytter:', cabinsError?.message);
        return;
      }

      const cabinIds = cabins.map(c => c.id);

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

      const shuffled = enriched.sort(() => 0.5 - Math.random());
      const unique = Array.from(new Map(shuffled.map(item => [item.id, item])).values());
      setCabins(unique.slice(0, 8));
    };

    fetchCabinsWithRatings();
  }, []);

  const prev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cabins.length - 1 : prevIndex - 1
    );
  };

  const next = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === cabins.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getPosition = (index) => {
    const total = cabins.length;
    const relIndex = (index - currentIndex + total) % total;

    if (relIndex === 0) return 'main';
    if (relIndex === 1) return 'right-1';
    if (relIndex === 2) return 'right-2';
    if (relIndex === total - 1) return 'left-1';
    if (relIndex === total - 2) return 'left-2';
    return 'off';
  };

  return (
    <CarouselWrapper>
      <PrevButton onClick={prev}>❮</PrevButton>
      <CarouselInner>
        {cabins.map((cabin, index) => (
          <Link key={cabin.id} to={`/hytte/${cabin.id}`}>
            <CarouselCabinCard $position={getPosition(index)}>
              {cabin.image_urls?.[0] && (
                <CarouselImage src={cabin.image_urls[0]} alt={cabin.title} />
              )}
              <CarouselInfo>
                <CarouselTitle>{cabin.title}</CarouselTitle>
                <CarouselLocation>{cabin.location}</CarouselLocation>
                <CarouselPrice>{formatPrice(cabin.price_per_night)} / natt</CarouselPrice>
                <StarRating score={cabin.average_score} />
              </CarouselInfo>
            </CarouselCabinCard>
          </Link>
        ))}
      </CarouselInner>
      <NextButton onClick={next}>❯</NextButton>
    </CarouselWrapper>
  );
}