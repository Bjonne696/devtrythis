import React from 'react';
import Navigation from '../components/nav/Navigation';
import Footer from '../components/nav/Footer';
import {
  NotFoundWrapper,
  NotFoundContent,
  NotFoundIcon,
  NotFoundTitle,
  NotFoundSubtitle,
  NotFoundDescription,
  NotFoundActions,
  NotFoundLink,
  NotFoundSecondaryLink,
  SuggestedLinks,
  SuggestedTitle,
  SuggestedGrid,
  SuggestedLink
} from '../styles/pages/notFoundPageStyles';

export default function NotFoundPage() {
  return (
    <NotFoundWrapper>
      <Navigation />
      <NotFoundContent>
        <NotFoundIcon>🏔️</NotFoundIcon>
        <NotFoundTitle>404</NotFoundTitle>
        <NotFoundSubtitle>Siden ble ikke funnet</NotFoundSubtitle>
        <NotFoundDescription>
          Beklager, men siden du leter etter finnes ikke. 
          Den kan ha blitt flyttet, slettet, eller du kan ha skrevet inn feil adresse.
        </NotFoundDescription>
        <NotFoundActions>
          <NotFoundLink to="/">
            Gå til forsiden
          </NotFoundLink>
          <NotFoundSecondaryLink to="/til-leie">
            Se ledige hytter
          </NotFoundSecondaryLink>
        </NotFoundActions>
        <SuggestedLinks>
          <SuggestedTitle>Kanskje du leter etter:</SuggestedTitle>
          <SuggestedGrid>
            <SuggestedLink to="/til-leie">Til leie</SuggestedLink>
            <SuggestedLink to="/nye-hytter">Nye hytter</SuggestedLink>
            <SuggestedLink to="/popular">Populære</SuggestedLink>
            <SuggestedLink to="/kontakt">Kontakt oss</SuggestedLink>
            <SuggestedLink to="/om-oss">Om oss</SuggestedLink>
          </SuggestedGrid>
        </SuggestedLinks>
      </NotFoundContent>
      <Footer />
    </NotFoundWrapper>
  );
}
