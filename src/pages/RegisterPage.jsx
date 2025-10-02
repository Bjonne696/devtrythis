import React from 'react';
import Navigation from '../components/nav/Navigation';
import Footer from '../components/nav/Footer';
import SignUp from '../components/auth/SignUp';
import { PageWrapper, CenteredMainContent } from "../styles/layout/pageStyles";

export default function RegisterPage() {
  return (
    <PageWrapper>
      <Navigation />
      <CenteredMainContent>
        <SignUp />
      </CenteredMainContent>
      <Footer />
    </PageWrapper>
  );
}