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
import {
  CreateListingIconSection,
  CreateListingIcon,
  CreateListingInfo,
  CreateListingTitle,
  CreateListingDescription,
  CreateListingCTA,
  CreateListingCarouselCard
} from '../../styles/cabins/createListingCardStyles';

export default function CabinCarousel() {
  const [cabins, setCabins] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    const fetchCabinsWithRatings = async () => {
      const { data: cabins, error: cabinsError } = await supabase
        .from('cabins')
        .select('*')
        .eq('is_active', true)
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

  const showCreateListingCard = cabins.length <= 4;

  const carouselItems = showCreateListingCard
    ? [...cabins, { id: '__create_listing__', isCreateListing: true }]
    : cabins;

  const prev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const next = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getPosition = (index) => {
    const total = carouselItems.length;
    const relIndex = (index - currentIndex + total) % total;

    if (relIndex === 0) return 'main';
    if (relIndex === 1) return 'right-1';
    if (relIndex === 2) return 'right-2';
    if (relIndex === total - 1) return 'left-1';
    if (relIndex === total - 2) return 'left-2';
    return 'off';
  };

  const handleCreateListingClick = () => {
    if (user) {
      window.location.href = '/ny-hytte';
    } else {
      sessionStorage.setItem('redirectAfterAuth', '/ny-hytte');
      window.location.href = '/register';
    }
  };

  return (
    <CarouselWrapper>
      <PrevButton onClick={prev}>❮</PrevButton>
      <CarouselInner>
        {carouselItems.map((item, index) => {
          if (item.isCreateListing) {
            return (
              <CreateListingCarouselCard
                key="create-listing"
                $position={getPosition(index)}
                onClick={handleCreateListingClick}
              >
                <CreateListingIconSection>
                  <CreateListingIcon>🏠</CreateListingIcon>
                </CreateListingIconSection>
                <CreateListingInfo>
                  <CreateListingTitle>Leie ut din hytte?</CreateListingTitle>
                  <CreateListingDescription>
                    Del din hytte med andre og tjen ekstra inntekt på feriedager du ikke bruker den.
                  </CreateListingDescription>
                  <CreateListingCTA>
                    {user ? 'Opprett annonse' : 'Kom i gang'}
                  </CreateListingCTA>
                </CreateListingInfo>
              </CreateListingCarouselCard>
            );
          }

          return (
            <Link key={item.id} to={`/hytte/${item.id}`}>
              <CarouselCabinCard $position={getPosition(index)}>
                {item.image_urls?.[0] && (
                  <CarouselImage src={item.image_urls[0]} alt={item.title} />
                )}
                <CarouselInfo>
                  <CarouselTitle>{item.title}</CarouselTitle>
                  <CarouselLocation>{item.location}</CarouselLocation>
                  <CarouselPrice>{formatPrice(item.price_per_night)} / natt</CarouselPrice>
                  <StarRating score={item.average_score} />
                </CarouselInfo>
              </CarouselCabinCard>
            </Link>
          );
        })}
      </CarouselInner>
      <NextButton onClick={next}>❯</NextButton>
    </CarouselWrapper>
  );
}