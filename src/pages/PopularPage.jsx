import React, { useState, useEffect } from "react";
import Navigation from '../components/nav/Navigation';
import Footer from "../components/nav/Footer";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import { formatPrice } from "../utils/formatters";
import HelpText from "../components/ui/HelpText";
import Tooltip from "../components/ui/Tooltip";
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
} from '../styles/layout/pageStyles';
import StarRating from "../components/ui/StarRating";
import CreateListingCard from "../components/cabins/CreateListingCard";

export default function PopularPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allPopularCabins, setAllPopularCabins] = useState([]);
  const [filteredCabins, setFilteredCabins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
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

  const commonFacilities = [
    "Kjøkken",
    "Peis", 
    "Badstue",
    "Parkering",
    "Kjæledyr tillatt",
    "WiFi"
  ];

  const handleCabinClick = (cabinId) => {
    navigate(`/hytte/${cabinId}`);
  };

  useEffect(() => {
    const fetchPopularCabins = async () => {
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

      if (reviewsError) {
        console.error('Feil ved henting av vurderinger:', reviewsError.message);
        setAllPopularCabins([]);
        setIsLoading(false);
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

        setAllPopularCabins(popularCabins);
        setFilteredCabins(popularCabins);
      } else {
        setAllPopularCabins([]);
        setFilteredCabins([]);
      }
      setIsLoading(false);
    };

    fetchPopularCabins();
  }, []);

  useEffect(() => {
    const filterCabins = async () => {
      let filtered = allPopularCabins;

      if (searchTerm) {
        filtered = filtered.filter(cabin =>
          cabin.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cabin.location?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (minPrice || maxPrice) {
        filtered = filtered.filter(cabin => {
          const price = cabin.price_per_night;
          const min = minPrice ? parseFloat(minPrice) : 0;
          const max = maxPrice ? parseFloat(maxPrice) : Infinity;
          return price >= min && price <= max;
        });
      }

      if (selectedFacilities.length > 0) {
        filtered = filtered.filter(cabin => {
          const cabinFacilities = cabin.facilities || [];
          return selectedFacilities.every(facility =>
            cabinFacilities.includes(facility)
          );
        });
      }

      if (checkInDate && checkOutDate) {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkIn < checkOut) {
          const availableCabins = [];

          for (const cabin of filtered) {
            const { data: bookings, error } = await supabase
              .from('bookings')
              .select('start_date, end_date')
              .eq('cabin_id', cabin.id)
              .eq('status', 'approved');

            if (!error && bookings) {
              const hasConflict = bookings.some(booking => {
                const bookingStart = new Date(booking.start_date);
                const bookingEnd = new Date(booking.end_date);
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
  }, [searchTerm, allPopularCabins, minPrice, maxPrice, selectedFacilities, checkInDate, checkOutDate]);

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

  const today = new Date().toISOString().split('T')[0];
  const minCheckOutDate = checkInDate ? new Date(new Date(checkInDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : today;

  return (
    <PageWrapper>
      <Navigation />
      <MainContent>
        <h1>Populære hytter</h1>

        <HelpText icon="⭐" id="popular">
          <strong>Finn de beste hyttene!</strong><br />
          Her vises kun hytter med høy vurdering (3.5+ stjerner). Bruk filtrene for å finne din drømmehytte.
        </HelpText>

        <TilLeieSearchContainer>
          <SearchInput
            type="text"
            placeholder="Søk etter populære hytter (tittel eller område)..."
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

        <SectionTitle>
          {(() => {
            const hasFilters = searchTerm || minPrice || maxPrice || selectedFacilities.length > 0 || checkInDate || checkOutDate;
            const dateText = checkInDate && checkOutDate ? ` for ${new Date(checkInDate).toLocaleDateString('no-NO')} - ${new Date(checkOutDate).toLocaleDateString('no-NO')}` : '';

            if (searchTerm) {
              return `Søkeresultater for "${searchTerm}"${dateText} (${filteredCabins.length})`;
            } else if (hasFilters) {
              return `Filtrerte populære hytter${dateText} (${filteredCabins.length})`;
            } else {
              return `Alle populære hytter (${filteredCabins.length})`;
            }
          })()}
        </SectionTitle>

        {error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : isLoading ? (
          <LoadingSpinner>Laster hytter...</LoadingSpinner>
        ) : currentCabins.length === 0 ? (
          <>
            <NoResults>
              {searchTerm || minPrice || maxPrice || selectedFacilities.length > 0 || checkInDate || checkOutDate
                ? checkInDate && checkOutDate
                  ? 'Ingen populære hytter er tilgjengelige for de valgte datoene og filtrene.'
                  : 'Ingen populære hytter matcher dine filtre.'
                : 'Ingen populære hytter tilgjengelig for øyeblikket.'}
            </NoResults>
            <GridWrapper $centered>
              <CreateListingCard isLoggedIn={!!user} />
            </GridWrapper>
          </>
        ) : (
          <>
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
              {currentCabins.length < 12 && <CreateListingCard isLoggedIn={!!user} />}
            </GridWrapper>

            {totalPages > 1 && (
              <PaginationContainer>
                <PaginationButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Forrige
                </PaginationButton>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}
