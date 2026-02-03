import React from "react";
import Navigation from '../components/nav/Navigation';
import Footer from "../components/nav/Footer";
import NewCabinsGrid from "../components/cabins/NewCabinsGrid";
import { PageWrapper, MainContent } from "../styles/layout/pageStyles";

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
