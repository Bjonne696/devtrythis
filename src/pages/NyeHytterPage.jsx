import React from "react";
import Navigation from '../components/nav/Navigation';
import Footer from "../components/nav/Footer";
import NewCabinsGrid from "../components/cabins/NewCabinsGrid";
import HelpText from "../components/ui/HelpText";
import { PageWrapper, MainContent } from "../styles/layout/pageStyles";

export default function NyeHytterPage() {
  return (
    <PageWrapper>
      <Navigation />
      <MainContent>
        <h1>Nye hytter</h1>
        <HelpText icon="🏠" id="nye-hytter">
          <strong>Utforsk de nyeste hyttene!</strong><br />
          Her finner du hytter som nylig er lagt ut på Ferieplassen. Vær tidlig ute og book din favoritt.
        </HelpText>
        <NewCabinsGrid />
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}
