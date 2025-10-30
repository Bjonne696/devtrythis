import React from 'react';
import Navigation from '../components/nav/Navigation';
import Footer from '../components/nav/Footer';
import {
  TermsContainer,
  PageTitle,
  LastUpdated,
  Section,
  SectionTitle,
  SubTitle,
  Paragraph,
  List,
  ContactBox,
  ContactInfo
} from '../styles/pages/termsOfSaleStyles';

export default function TermsOfSale() {
  return (
    <>
      <Navigation />
      <TermsContainer>
      <PageTitle>Salgsbetingelser</PageTitle>
      <LastUpdated>Sist oppdatert: Oktober 2025</LastUpdated>

      <Section>
        <SectionTitle>1. Generelt</SectionTitle>
        <Paragraph>
          Disse salgsbetingelsene gjelder for utleie av hytter gjennom Berge Hyttene, 
          eid av Anita Berge (org.nr. 926 576 259). Ved å gjennomføre en booking 
          aksepterer du disse vilkårene.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>2. Betaling</SectionTitle>
        
        <SubTitle>2.1 Betalingsmetode</SubTitle>
        <Paragraph>
          Vi aksepterer betaling via Vipps MobilePay. All betaling skal gjøres før 
          innsjekking på hytta.
        </Paragraph>

        <SubTitle>2.2 Abonnement for hytteeiere</SubTitle>
        <Paragraph>
          Hytteeiere som ønsker å liste sin hytte på plattformen må ha et aktivt 
          abonnement. Vi tilbyr to abonnementsplaner:
        </Paragraph>
        <List>
          <li><strong>Standard:</strong> 99 NOK per måned</li>
          <li><strong>Premium:</strong> 149 NOK per måned</li>
        </List>
        <Paragraph>
          Abonnementet faktureres månedlig via Vipps MobilePay Recurring og kan 
          kanselleres når som helst uten bindingstid.
        </Paragraph>

        <SubTitle>2.3 Leiebetaling</SubTitle>
        <Paragraph>
          Leietaker betaler avtalt beløp direkte til hytteeier etter godkjent booking. 
          Berge Hyttene er kun en formidlingsplattform og håndterer ikke leiebetaling 
          mellom leietaker og hytteeier.
        </Paragraph>

        <SubTitle>2.4 Betalingsfrist</SubTitle>
        <Paragraph>
          Abonnement trekkes automatisk hver måned. Ved forfall av betaling vil hytta 
          bli deaktivert fra plattformen inntil betaling er gjennomført.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>3. Angrerett</SectionTitle>
        
        <SubTitle>3.1 Angrefrist</SubTitle>
        <Paragraph>
          I henhold til norsk lov (angrerettloven) har du som forbruker 14 dagers 
          angrefrist fra kjøpsdato. Angrefristen gjelder for:
        </Paragraph>
        <List>
          <li>Abonnement for hytteeiere (14 dager fra opprettelse)</li>
          <li>Bookingbestillinger (14 dager fra bestillingsdato, forutsatt at leieperioden ikke har startet)</li>
        </List>

        <SubTitle>3.2 Hvordan benytte angreretten</SubTitle>
        <Paragraph>
          For å benytte angreretten, send e-post til <a href="mailto:Anitaberge@yahoo.no">Anitaberge@yahoo.no</a> med 
          følgende informasjon:
        </Paragraph>
        <List>
          <li>Ditt fulle navn</li>
          <li>Bestillingsnummer eller abonnements-ID</li>
          <li>Beskrivelse av hva du ønsker å angre på</li>
        </List>

        <SubTitle>3.3 Tilbakebetaling</SubTitle>
        <Paragraph>
          Ved gyldig bruk av angreretten vil du motta full refusjon innen 14 dager 
          fra vi har mottatt din angremelding. Refusjon utbetales til samme konto 
          som betalingen ble gjort fra.
        </Paragraph>

        <SubTitle>3.4 Unntak fra angreretten</SubTitle>
        <Paragraph>
          Angreretten gjelder ikke dersom leieperioden allerede har startet eller 
          hvis det er mindre enn 14 dager til innsjekking.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>4. Retur og kansellering</SectionTitle>
        
        <SubTitle>4.1 Kansellering av booking</SubTitle>
        <Paragraph>
          Bookinger kan kanselleres direkte gjennom plattformen eller ved å kontakte 
          hytteeier. Refusjonsrett ved kansellering avgjøres av den enkelte hytteeier 
          og bør avtales direkte mellom leietaker og hytteeier.
        </Paragraph>

        <SubTitle>4.2 Kansellering av abonnement</SubTitle>
        <Paragraph>
          Hytteeiere kan kansellere sitt abonnement når som helst uten bindingstid. 
          Kanselleringen trer i kraft ved slutten av inneværende betalingsperiode. 
          Hytta vil bli deaktivert fra plattformen når abonnementet avsluttes.
        </Paragraph>
        <Paragraph>
          For å kansellere abonnement, logg inn på din profil og velg 
          "Kanseller abonnement" under abonnementsinformasjon.
        </Paragraph>

        <SubTitle>4.3 Ingen refusjon ved delvis bruk</SubTitle>
        <Paragraph>
          Det gis ikke refusjon for ubrukte deler av abonnementsperioder.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>5. Klagehåndtering</SectionTitle>
        
        <SubTitle>5.1 Reklamasjon</SubTitle>
        <Paragraph>
          Hvis du opplever problemer med plattformen, ditt abonnement eller har andre 
          klager, ta kontakt med oss så raskt som mulig.
        </Paragraph>

        <SubTitle>5.2 Hvordan klage</SubTitle>
        <Paragraph>
          Klager kan sendes til oss via e-post eller telefon. Vi forventer å motta 
          klager innen rimelig tid etter at problemet oppstod.
        </Paragraph>

        <SubTitle>5.3 Behandling av klager</SubTitle>
        <Paragraph>
          Vi vil behandle din klage snarest mulig, normalt innen 5 virkedager. Du vil 
          motta en bekreftelse på at klagen er mottatt samt informasjon om videre 
          behandling.
        </Paragraph>

        <SubTitle>5.4 Tvister mellom leietaker og hytteeier</SubTitle>
        <Paragraph>
          Berge Hyttene er en formidlingsplattform. Tvister som oppstår mellom 
          leietaker og hytteeier angående selve leieavtalen må løses direkte mellom 
          partene. Vi kan bistå med formidling ved behov.
        </Paragraph>

        <SubTitle>5.5 Forbrukerrådet</SubTitle>
        <Paragraph>
          Hvis du ikke er fornøyd med vår håndtering av klagen, kan du kontakte 
          Forbrukerrådet for veiledning eller ta saken til Forbrukertvistutvalget.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>6. Personvern</SectionTitle>
        <Paragraph>
          Vi behandler dine personopplysninger i henhold til GDPR og norsk 
          personvernlovgivning. Les vår personvernerklæring for mer informasjon 
          om hvordan vi samler inn, bruker og beskytter dine data.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>7. Endringer i vilkårene</SectionTitle>
        <Paragraph>
          Vi forbeholder oss retten til å endre disse salgsbetingelsene. Eventuelle 
          endringer vil bli publisert på denne siden med oppdatert dato. Ved vesentlige 
          endringer vil eksisterende kunder bli varslet via e-post.
        </Paragraph>
      </Section>

      <ContactBox>
        <ContactInfo>
          <strong>Kontaktinformasjon:</strong><br />
          Berge Hyttene - Eid av Anita Berge<br />
          Org.nr: 926 576 259<br />
          E-post: <a href="mailto:Anitaberge@yahoo.no">Anitaberge@yahoo.no</a><br />
          Nettside: www.bergehyttene.no
        </ContactInfo>
      </ContactBox>
    </TermsContainer>
    <Footer />
    </>
  );
}
