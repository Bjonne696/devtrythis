import React, { useEffect, useState } from "react";
import Navigation from "../components/nav/Navigation";
import Footer from "../components/nav/Footer";
import CabinCarousel from "../components/cabins/CabinCarousel";
import supabase from "../lib/supabaseClient";
import { formatPrice } from "../utils/formatters";
import { Link } from "react-router-dom";
import {
  PageWrapper,
  MainContent,
  SearchContainer,
  SearchInput,
  SearchResultsSection,
  SectionTitle,
  PaginationContainer,
  PaginationButton,
  NoResults,
} from "../styles/layout/homePageStyles";
import {
  GridWrapper,
  CabinCard,
  CabinImage,
  CabinInfo,
  CabinTitle,
  CabinLocation,
  CabinPrice,
  RatingStars,
} from "../styles/cabins/cabinStyles";
import StarRating from "../components/ui/StarRating";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allCabins, setAllCabins] = useState([]);
  const [filteredCabins, setFilteredCabins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cabinsPerPage = 8;

  useEffect(() => {
    const fetchAllCabins = async () => {
      const { data: cabins, error: cabinsError } = await supabase
        .from("cabins")
        .select("*")
        .eq("is_active", true);

      if (cabinsError || !cabins) {
        console.error("Feil ved henting av hytter:", cabinsError?.message);
        return;
      }

      const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("cabin_id, rating");

      const ratingsMap = {};

      if (!reviewsError && reviews) {
        reviews.forEach(({ cabin_id, rating }) => {
          if (!ratingsMap[cabin_id]) ratingsMap[cabin_id] = [];
          ratingsMap[cabin_id].push(rating);
        });
      }

      const enriched = cabins.map((cabin) => {
        const ratings = ratingsMap[cabin.id] || [];
        const avg = ratings.length
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;
        const boosted = Math.min(avg + (cabin.is_premium ? 1.5 : 0), 5);
        return { ...cabin, average_score: boosted };
      });

      setAllCabins(enriched);
      setFilteredCabins(enriched);
    };

    fetchAllCabins();
  }, []);

  useEffect(() => {
    const filtered = allCabins.filter(
      (cabin) =>
        cabin.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cabin.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cabin.price_per_night?.toString().includes(searchTerm),
    );
    setFilteredCabins(filtered);
    setCurrentPage(1);
  }, [searchTerm, allCabins]);

  const indexOfLastCabin = currentPage * cabinsPerPage;
  const indexOfFirstCabin = indexOfLastCabin - cabinsPerPage;
  const currentCabins = filteredCabins.slice(
    indexOfFirstCabin,
    indexOfLastCabin,
  );
  const totalPages = Math.ceil(filteredCabins.length / cabinsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <PageWrapper>
      <Navigation />
      <MainContent>
        <h1>Velkommen til Berge Hyttene</h1>
        <CabinCarousel />
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Søk etter hytter (tittel, område eller pris)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <SearchResultsSection>
          <SectionTitle>
            {searchTerm
              ? `Søkeresultater for "${searchTerm}" (${filteredCabins.length})`
              : `Alle hytter (${filteredCabins.length})`}
          </SectionTitle>

          {currentCabins.length === 0 ? (
            <NoResults>
              {searchTerm
                ? "Ingen hytter matcher søket ditt."
                : "Ingen hytter tilgjengelig for øyeblikket."}
            </NoResults>
          ) : (
            <>
              <GridWrapper>
                {currentCabins.map((cabin) => (
                  <Link
                    key={cabin.id}
                    to={`/hytte/${cabin.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <CabinCard>
                      {cabin.image_urls?.[0] && (
                        <CabinImage
                          src={cabin.image_urls[0]}
                          alt={cabin.title}
                        />
                      )}
                      <CabinInfo>
                        <CabinTitle>{cabin.title}</CabinTitle>
                        <CabinLocation>{cabin.location}</CabinLocation>
                        <CabinPrice>
                          {formatPrice(cabin.price_per_night)} / natt
                        </CabinPrice>
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

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationButton
                        key={page}
                        $active={page === currentPage}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationButton>
                    ),
                  )}

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
