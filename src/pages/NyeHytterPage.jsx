import React from "react";
import LogoHeader from '../components/nav/LogoHeader';
import Header from "../components/nav/Header";
import Footer from "../components/nav/Footer";
import NewCabinsGrid from "../components/cabins/NewCabinsGrid";
import { NyeHytterPageWrapper as PageWrapper, NyeHytterMainContent as MainContent } from "../styles/pages/nyeHytterPageStyles";

export default function NyeHytterPage() {
  return (
    <PageWrapper>
      <LogoHeader />
      <Header />
      <MainContent>
        <h1>Nye hytter</h1>
        <NewCabinsGrid />
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}
