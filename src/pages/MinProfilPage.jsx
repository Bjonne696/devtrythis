import React from "react";
import LogoHeader from "../components/nav/LogoHeader";
import Header from "../components/nav/Header";
import Footer from "../components/nav/Footer";
import ProfileData from "../components/profile/ProfileData";
import { MainWrapper, Heading } from "../styles/pages/minProfilPageStyles";

export default function MinProfilPage() {
  return (
    <div>
      <LogoHeader />
      <Header />
      <MainWrapper>
        <Heading>Min profil</Heading>
        <ProfileData />
      </MainWrapper>
      <Footer />
    </div>
  );
}
