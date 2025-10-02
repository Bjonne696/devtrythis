import React from 'react';
import LogoHeader from '../components/nav/LogoHeader';
import Header from '../components/nav/Header';
import Footer from '../components/nav/Footer';
import SignIn from '../components/auth/SignIn';
import { PageWrapper, MainContent } from "../styles/layout/pageStyles";

export default function LoginPage() {
  return (
    <PageWrapper>
      <LogoHeader />
      <Header />
      <MainContent>
        <SignIn />
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}