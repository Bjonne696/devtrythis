import React, { useState, useEffect } from "react";
import Navigation from '../components/nav/Navigation';
import Footer from "../components/nav/Footer";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import { formatPrice } from "../utils/formatters";
import HelpText from "../components/ui/HelpText";
import {
  GridWrapper,
  CabinCard,
  CabinImage,
  CabinInfo,
  CabinTitle,
  CabinLocation,
  CabinPrice
} from '../styles/cabins/cabinStyles';
import {
  PageWrapper,
  MainContent,
  SectionTitle,
  PaginationContainer,
  PaginationButton,
  LoadingSpinner,
  ErrorMessage,
  NoResults
} from '../styles/layout/pageStyles';
import StarRating from "../components/ui/StarRating";
import CreateListingCard from "../components/cabins/CreateListingCard";

export default function PopularPage() {
  const [cabins, setCabins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const cabinsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    const fetchPopularCabins = async () => {
      setIsLoading(true);
      const { data: allCabins, error: cabinsError } = await supabase
        .from('cabins')
        .select('*')
        .eq('is_active', true);

      if (cabinsError || !allCabins) {
        setError('Kunne ikke laste feriebolig. Prøv igjen senere.');
        setIsLoading(false);
        return;
      }

      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('cabin_id, rating');

      if (reviewsError || !reviews || reviews.length === 0) {
        setCabins([]);
        setIsLoading(false);
        return;
      }

      const ratingsMap = {};
      reviews.forEach(({ cabin_id, rating }) => {
        if (!ratingsMap[cabin_id]) ratingsMap[cabin_id] = [];
        ratingsMap[cabin_id].push(rating);
      });

      const popularCabins = allCabins
        .map(cabin => {
          const ratings = ratingsMap[cabin.id] || [];
          const avg = ratings.length
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;
          const boosted = Math.min(avg + (cabin.is_premium ? 1.5 : 0), 5);
          return { ...cabin, avgRating: boosted };
        })
        .filter(cabin => cabin.avgRating >= 3.5);

      setCabins(popularCabins);
      setIsLoading(false);
    };

    fetchPopularCabins();
  }, []);

  const indexOfLastCabin = currentPage * cabinsPerPage;
  const indexOfFirstCabin = indexOfLastCabin - cabinsPerPage;
  const currentCabins = cabins.slice(indexOfFirstCabin, indexOfLastCabin);
  const totalPages = Math.ceil(cabins.length / cabinsPerPage);

  return (
    <PageWrapper>
      <Navigation />
      <MainContent>
        <h1>Populære feriebolig</h1>

        <HelpText icon="⭐" id="popular">
          <strong>Finn de beste ferieboligene!</strong><br />
          Her vises kun feriebolig med høy vurdering (3.5+ stjerner).
        </HelpText>

        <SectionTitle>
          {`Populære annonser (${cabins.length})`}
        </SectionTitle>

        {error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : isLoading ? (
          <LoadingSpinner>Laster feriebolig...</LoadingSpinner>
        ) : currentCabins.length === 0 ? (
          <>
            <NoResults>Ingen populære feriebolig tilgjengelig for øyeblikket.</NoResults>
            <GridWrapper $centered>
              <CreateListingCard isLoggedIn={!!user} />
            </GridWrapper>
          </>
        ) : (
          <>
            <GridWrapper>
              {currentCabins.map((cabin) => (
                <CabinCard key={cabin.id} onClick={() => navigate(`/hytte/${cabin.id}`)}>
                  {cabin.image_urls && cabin.image_urls.length > 0 && (
                    <CabinImage src={cabin.image_urls[0]} alt={cabin.title} />
                  )}
                  <CabinInfo>
                    <CabinTitle>{cabin.title}</CabinTitle>
                    <CabinLocation>{cabin.location}</CabinLocation>
                    <CabinPrice>{formatPrice(cabin.price_per_night)} / natt</CabinPrice>
                    <StarRating score={cabin.avgRating} />
                  </CabinInfo>
                </CabinCard>
              ))}
              {currentCabins.length < 12 && <CreateListingCard isLoggedIn={!!user} />}
            </GridWrapper>

            {totalPages > 1 && (
              <PaginationContainer>
                <PaginationButton
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                >
                  Forrige
                </PaginationButton>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationButton
                    key={page}
                    $active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationButton>
                ))}

                <PaginationButton
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === totalPages}
                >
                  Neste
                </PaginationButton>
              </PaginationContainer>
            )}
          </>
        )}
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}
