import React from 'react';
import Navigation from '../components/nav/Navigation';
import Footer from '../components/nav/Footer';
import SignIn from '../components/auth/SignIn';
import { PageWrapper, MainContent } from "../styles/layout/pageStyles";

export default function LoginPage() {
  return (
    <PageWrapper>
      <Navigation />
      <MainContent>
        <SignIn />
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}