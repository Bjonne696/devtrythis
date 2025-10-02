import React from "react";
import LogoHeader from '../components/nav/LogoHeader';
import NewCabinForm from "../components/cabins/NewCabinForm";
import Header from "../components/nav/Header";
import Footer from "../components/nav/Footer";
import { NyHyttePageWrapper as PageWrapper, NyHytteMainContent as MainContent } from "../styles/pages/nyHyttePageStyles";

export default function NyHyttePage() {
  return (
    <PageWrapper>
      <LogoHeader />
      <Header />
      <MainContent>
        <NewCabinForm />
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}
