import React from "react";
import Navigation from '../components/nav/Navigation';
import NewCabinForm from "../components/cabins/NewCabinForm";
import Footer from "../components/nav/Footer";
import { NyHyttePageWrapper as PageWrapper, NyHytteMainContent as MainContent } from "../styles/pages/nyHyttePageStyles";

export default function NyHyttePage() {
  return (
    <PageWrapper>
      <Navigation />
      <MainContent>
        <NewCabinForm />
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}
