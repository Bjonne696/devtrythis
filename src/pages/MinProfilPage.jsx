import React from "react";
import Navigation from "../components/nav/Navigation";
import Footer from "../components/nav/Footer";
import ProfileData from "../components/profile/ProfileData";
import { MainWrapper, Heading } from "../styles/pages/minProfilPageStyles";

export default function MinProfilPage() {
  return (
    <div>
      <Navigation />
      <MainWrapper>
        <Heading>Min profil</Heading>
        <ProfileData />
      </MainWrapper>
      <Footer />
    </div>
  );
}
