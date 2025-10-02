import React from "react";
import Navigation from '../components/nav/Navigation';
import Footer from "../components/nav/Footer";
import NewCabinsGrid from "../components/cabins/NewCabinsGrid";
import { NyeHytterPageWrapper as PageWrapper, NyeHytterMainContent as MainContent } from "../styles/pages/nyeHytterPageStyles";

export default function NyeHytterPage() {
  return (
    <PageWrapper>
      <Navigation />
      <MainContent>
        <h1>Nye hytter</h1>
        <NewCabinsGrid />
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}
