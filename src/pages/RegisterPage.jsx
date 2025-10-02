import React from 'react';
import LogoHeader from '../components/nav/LogoHeader';
import Header from '../components/nav/Header';
import Footer from '../components/nav/Footer';
import SignUp from '../components/auth/SignUp';
import { PageWrapper, CenteredMainContent } from "../styles/layout/pageStyles";

export default function RegisterPage() {
  return (
    <PageWrapper>
      <LogoHeader />
      <Header />
      <CenteredMainContent>
        <SignUp />
      </CenteredMainContent>
      <Footer />
    </PageWrapper>
  );
}