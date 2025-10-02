import React, { useEffect, useState } from "react";
import LogoHeader from '../components/nav/LogoHeader';
import Header from "../components/nav/Header";
import Footer from "../components/nav/Footer";
import styled from "styled-components";
import supabase from "../lib/supabaseClient";
import { formatPrice } from "../utils/formatters";
import { Link } from "react-router-dom";
import HelpText from "../components/ui/HelpText";
import Tooltip from "../components/ui/Tooltip";
import ErrorBoundary from '../components/ui/ErrorBoundary';

import {
  TilLeieSearchContainer,
  FiltersContainer,
  FilterGroup,
  FilterLabel,
  PriceRangeContainer,
  PriceInput,
  FacilitiesContainer,
  FacilityCheckbox,
  DateRangeContainer,
  DateInput,
  DateSeparator,
  ClearFiltersButton
} from "../styles/pages/tilLeiePageStyles";
import {
  PageWrapper,
  MainContent,
  SearchInput,
  SectionTitle,
  PaginationContainer,
  PaginationButton,
  LoadingSpinner,
  ErrorMessage,
  NoResults
} from "../styles/layout/pageStyles";
import {
  GridWrapper,
  CabinCard,
  CabinImage,
  CabinInfo,
  CabinTitle,
  CabinLocation,
  CabinPrice,
  RatingStars
} from "../styles/cabins/cabinStyles";

const SearchResultsSection = styled.div`
  margin-top: 2rem;
`;

const StarRating = ({ score }) => {
  if (score === 0) return null;

  const fullStars = Math.floor(score);
  const halfStar = score % 1 >= 0.25 && score % 1 < 0.75;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <RatingStars>
      {'★'.repeat(fullStars)}
      {halfStar && '⯪'}
      {'☆'.repeat(emptyStars)}
      <span style={{ marginLeft: 6, color: '#444' }}>{score.toFixed(1)}</span>
    </RatingStars>
  );
};

export default function TilLeiePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allCabins, setAllCabins] = useState([]);
  const [filteredCabins, setFilteredCabins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const cabinsPerPage = 8;

  const commonFacilities = [
    "Kjøkken",
    "Peis", 
    "Badstue",
    "Parkering",
    "Kjæledyr tillatt",
    "WiFi"
  ];

  useEffect(() => {
    const fetchAllCabins = async () => {
      setIsLoading(true);
      const { data: cabins, error: cabinsError } = await supabase
        .from('cabins')
        .select('*');

      if (cabinsError || !cabins) {
        console.error('Feil ved henting av hytter:', cabinsError?.message);
        setError('Kunne ikke laste hytter. Prøv igjen senere.');
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

      setAllCabins(enriched);
      setFilteredCabins(enriched);
      setIsLoading(false);
    };

    fetchAllCabins();
  }, []);

  useEffect(() => {
    const filterCabins = async () => {
      let filtered = allCabins;

      // Tekstsøk
      if (searchTerm) {
        filtered = filtered.filter(cabin =>
          cabin.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cabin.location?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Prisfilter
      if (minPrice || maxPrice) {
        filtered = filtered.filter(cabin => {
          const price = cabin.price_per_night;
          const min = minPrice ? parseFloat(minPrice) : 0;
          const max = maxPrice ? parseFloat(maxPrice) : Infinity;
          return price >= min && price <= max;
        });
      }

      // Fasilitetsfilter
      if (selectedFacilities.length > 0) {
        filtered = filtered.filter(cabin => {
          const cabinFacilities = cabin.facilities || [];
          return selectedFacilities.every(facility =>
            cabinFacilities.includes(facility)
          );
        });
      }

      // Datofilter - sjekk tilgjengelighet
      if (checkInDate && checkOutDate) {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkIn < checkOut) {
          const availableCabins = [];

          for (const cabin of filtered) {
            // Hent bookinger for denne hytten
            const { data: bookings, error } = await supabase
              .from('bookings')
              .select('start_date, end_date')
              .eq('cabin_id', cabin.id)
              .eq('status', 'approved');

            if (!error && bookings) {
              // Sjekk om det er konflikt med eksisterende bookinger
              const hasConflict = bookings.some(booking => {
                const bookingStart = new Date(booking.start_date);
                const bookingEnd = new Date(booking.end_date);

                // Sjekk om ønskede datoer overlapper med eksisterende booking
                return (checkIn < bookingEnd && checkOut > bookingStart);
              });

              if (!hasConflict) {
                availableCabins.push(cabin);
              }
            }
          }

          filtered = availableCabins;
        }
      }

      setFilteredCabins(filtered);
      setCurrentPage(1);
    };

    filterCabins();
  }, [searchTerm, allCabins, minPrice, maxPrice, selectedFacilities, checkInDate, checkOutDate]);

  const indexOfLastCabin = currentPage * cabinsPerPage;
  const indexOfFirstCabin = indexOfLastCabin - cabinsPerPage;
  const currentCabins = filteredCabins.slice(indexOfFirstCabin, indexOfLastCabin);
  const totalPages = Math.ceil(filteredCabins.length / cabinsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFacilityToggle = (facility) => {
    setSelectedFacilities(prev =>
      prev.includes(facility)
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedFacilities([]);
    setCheckInDate("");
    setCheckOutDate("");
  };

  // Hjelp funksjoner for datovalidering
  const today = new Date().toISOString().split('T')[0];
  const minCheckOutDate = checkInDate ? new Date(new Date(checkInDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : today;

  return (
    <PageWrapper>
      <LogoHeader />
      <Header />
      <MainContent>
        <h1>Til leie</h1>

        <HelpText icon="🔍">
          <strong>Finn din perfekte hytte!</strong><br />
          Bruk søkefeltet for å finne hytter etter sted. Kombiner med filtre for å snevre inn søket ditt.
        </HelpText>

        <TilLeieSearchContainer>
          <SearchInput
            type="text"
            placeholder="Søk etter hytter (tittel eller område)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <FiltersContainer>
            <FilterGroup>
              <Tooltip text="Filtrer hytter basert på pris per natt. La felt stå tomme for å se alle priser.">
                <FilterLabel>Prisområde (per natt)</FilterLabel>
              </Tooltip>
              <PriceRangeContainer>
                <PriceInput
                  type="number"
                  placeholder="Fra"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span>-</span>
                <PriceInput
                  type="number"
                  placeholder="Til"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
                <span>kr</span>
              </PriceRangeContainer>
            </FilterGroup>

            <FilterGroup>
              <Tooltip text="Velg datoer for å se kun ledige hytter. Systemet sjekker automatisk om hyttene er tilgjengelige.">
                <FilterLabel>Oppholdsperiode</FilterLabel>
              </Tooltip>
              <DateRangeContainer>
                <DateInput
                  type="date"
                  value={checkInDate}
                  min={today}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  placeholder="Innsjekk"
                />
                <DateSeparator>til</DateSeparator>
                <DateInput
                  type="date"
                  value={checkOutDate}
                  min={minCheckOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  placeholder="Utsjekk"
                />
              </DateRangeContainer>
            </FilterGroup>

            <FilterGroup>
              <Tooltip text="Velg fasiliteter som er viktige for deg. Kun hytter med disse fasilitetene vil vises.">
                <FilterLabel>Fasiliteter</FilterLabel>
              </Tooltip>
              <FacilitiesContainer>
                {commonFacilities.map(facility => (
                  <FacilityCheckbox
                    key={facility}
                    $checked={selectedFacilities.includes(facility)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFacilities.includes(facility)}
                      onChange={() => handleFacilityToggle(facility)}
                    />
                    {facility}
                  </FacilityCheckbox>
                ))}
              </FacilitiesContainer>
            </FilterGroup>

            <ClearFiltersButton onClick={clearAllFilters}>
              Tøm alle filtre
            </ClearFiltersButton>
          </FiltersContainer>
        </TilLeieSearchContainer>

        <SearchResultsSection>
          <SectionTitle>
            {(() => {
              const hasFilters = searchTerm || minPrice || maxPrice || selectedFacilities.length > 0 || checkInDate || checkOutDate;
              const dateText = checkInDate && checkOutDate ? ` for ${new Date(checkInDate).toLocaleDateString('no-NO')} - ${new Date(checkOutDate).toLocaleDateString('no-NO')}` : '';

              if (searchTerm) {
                return `Søkeresultater for "${searchTerm}"${dateText} (${filteredCabins.length})`;
              } else if (hasFilters) {
                return `Filtrerte hytter${dateText} (${filteredCabins.length})`;
              } else {
                return `Alle hytter (${filteredCabins.length})`;
              }
            })()}
          </SectionTitle>

          {error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : isLoading ? (
            <LoadingSpinner>Laster hytter...</LoadingSpinner>
          ) : currentCabins.length === 0 ? (
            <NoResults>
              {searchTerm || minPrice || maxPrice || selectedFacilities.length > 0 || checkInDate || checkOutDate
                ? checkInDate && checkOutDate
                  ? 'Ingen hytter er tilgjengelige for de valgte datoene og filtrene.'
                  : 'Ingen hytter matcher dine filtre.'
                : 'Ingen hytter tilgjengelig for øyeblikket.'}
            </NoResults>
          ) : (
            <>
              <GridWrapper>
                {currentCabins.map((cabin) => (
                  <Link key={cabin.id} to={`/hytte/${cabin.id}`} style={{ textDecoration: 'none' }}>
                    <CabinCard>
                      {cabin.image_urls?.[0] && (
                        <CabinImage src={cabin.image_urls[0]} alt={cabin.title} />
                      )}
                      <CabinInfo>
                        <CabinTitle>{cabin.title}</CabinTitle>
                        <CabinLocation>{cabin.location}</CabinLocation>
                        <CabinPrice>{formatPrice(cabin.price_per_night)} / natt</CabinPrice>
                        <StarRating score={cabin.average_score} />
                      </CabinInfo>
                    </CabinCard>
                  </Link>
                ))}
              </GridWrapper>

              {totalPages > 1 && (
                <PaginationContainer>
                  <PaginationButton
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Forrige
                  </PaginationButton>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationButton
                      key={page}
                      $active={page === currentPage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationButton>
                  ))}

                  <PaginationButton
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Neste
                  </PaginationButton>
                </PaginationContainer>
              )}
            </>
          )}
        </SearchResultsSection>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}