import React from "react";
import LogoHeader from "../components/nav/LogoHeader";
import Header from "../components/nav/Header";
import Footer from "../components/nav/Footer";
import AdminData from "../components/admin/AdminData";
import { MainWrapper, Heading } from "../styles/admin/adminPageStyles";

export default function AdminPage() {
  return (
    <div>
      <LogoHeader />
      <Header />
      <MainWrapper>
        <Heading>Adminpanel</Heading>
        <AdminData />
      </MainWrapper>
      <Footer />
    </div>
  );
}