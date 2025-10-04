import React, { useState, useEffect } from "react";
import Navigation from '../components/nav/Navigation';
import Footer from "../components/nav/Footer";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import { formatPrice } from "../utils/formatters";
import {
  GridWrapper,
  CabinCard,
  CabinImage,
  CabinInfo,
  CabinTitle,
  CabinLocation,
  CabinPrice,
  RatingStars
} from '../styles/cabins/cabinStyles';
import {
  PageButton,
  ResultsText
} from '../styles/pages/popularPageStyles';
import {
  PageWrapper,
  MainContent,
  SearchContainer,
  SearchInput,
  PaginationContainer
} from '../styles/layout/pageStyles';
import StarRating from "../components/ui/StarRating";

export default function PopularPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allPopularCabins, setAllPopularCabins] = useState([]);
  const [filteredCabins, setFilteredCabins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cabinsPerPage = 8;
  const navigate = useNavigate();

  const handleCabinClick = (cabinId) => {
    navigate(`/hytte/${cabinId}`);
  };

  useEffect(() => {
    const fetchPopularCabins = async () => {
      const { data: cabins, error: cabinsError } = await supabase
        .from('cabins')
        .select('*')
        .eq('is_active', true);

      if (cabinsError || !cabins) {
        console.error('Feil ved henting av hytter:', cabinsError?.message);
        return;
      }

      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('cabin_id, rating');

      if (reviewsError) {
        console.error('Feil ved henting av vurderinger:', reviewsError.message);
        setAllPopularCabins([]);
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

        // Filtrerer ut hytter med snitt-rating > 3.5 (populære hytter)
        const popularCabins = cabinsWithAvgRating.filter(
          (cabin) => cabin.avgRating >= 3.5
        );

        setAllPopularCabins(popularCabins);
        setFilteredCabins(popularCabins);
      }
    };

    fetchPopularCabins();
  }, []);

  useEffect(() => {
    const filtered = allPopularCabins.filter(cabin =>
      cabin.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabin.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabin.price_per_night?.toString().includes(searchTerm)
    );
    setFilteredCabins(filtered);
    setCurrentPage(1);
  }, [searchTerm, allPopularCabins]);

  const indexOfLastCabin = currentPage * cabinsPerPage;
  const indexOfFirstCabin = indexOfLastCabin - cabinsPerPage;
  const currentCabins = filteredCabins.slice(indexOfFirstCabin, indexOfLastCabin);
  const totalPages = Math.ceil(filteredCabins.length / cabinsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <PageWrapper>
      <Navigation />
      <MainContent>
        <h1>Populære hytter</h1>

        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Søk etter populære hytter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <ResultsText>
          Viser {filteredCabins.length} populære {filteredCabins.length === 1 ? 'hytte' : 'hytter'}
          {searchTerm && ` for "${searchTerm}"`}
        </ResultsText>

        <GridWrapper>
          {currentCabins.map((cabin) => (
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

        {totalPages > 1 && (
          <PaginationContainer>
            <PageButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Forrige
            </PageButton>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <PageButton
                key={page}
                $active={page === currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PageButton>
            ))}

            <PageButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Neste
            </PageButton>
          </PaginationContainer>
        )}
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}