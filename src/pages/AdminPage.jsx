import React from "react";
import Navigation from "../components/nav/Navigation";
import Footer from "../components/nav/Footer";
import AdminData from "../components/admin/AdminData";
import { MainWrapper, Heading } from "../styles/admin/adminPageStyles";

export default function AdminPage() {
  return (
    <div>
      <Navigation />
      <MainWrapper>
        <Heading>Adminpanel</Heading>
        <AdminData />
      </MainWrapper>
      <Footer />
    </div>
  );
}