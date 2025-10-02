
import { 
  PageContainer, 
  ContentSection, 
  Title, 
  Subtitle, 
  TextBlock, 
  List, 
  ListItem,
  ContactInfo 
} from '../styles/pages/personvernPageStyles';
import Navigation from '../components/nav/Navigation';
import Footer from '../components/nav/Footer';

export default function PersonvernPage() {
  return (
    <>
      <Navigation />
      <PageContainer>
        <ContentSection>
          <Title>Personvernerklæring</Title>
          
          <TextBlock>
            Denne personvernerklæringen beskriver hvordan Berge-Hyttene samler inn, 
            bruker og beskytter dine personopplysninger i henhold til GDPR.
          </TextBlock>

          <Subtitle>Hvilke opplysninger samler vi inn?</Subtitle>
          <TextBlock>
            Vi samler inn følgende informasjon:
          </TextBlock>
          <List>
            <ListItem>Navn og kontaktinformasjon når du registrerer deg</ListItem>
            <ListItem>E-postadresse for kommunikasjon</ListItem>
            <ListItem>Booking- og leiehistorikk</ListItem>
            <ListItem>Tekniske data som IP-adresse og nettleserinfo</ListItem>
          </List>

          <Subtitle>Hvordan bruker vi informasjonen?</Subtitle>
          <List>
            <ListItem>For å administrere bookinger og utleie</ListItem>
            <ListItem>For å kommunisere med deg om dine bookinger</ListItem>
            <ListItem>For å forbedre våre tjenester</ListItem>
            <ListItem>For å oppfylle juridiske forpliktelser</ListItem>
          </List>

          <Subtitle>Informasjonskapsler (Cookies)</Subtitle>
          <TextBlock>
            Vi bruker informasjonskapsler for:
          </TextBlock>
          <List>
            <ListItem>Å holde deg innlogget (nødvendige cookies)</ListItem>
            <ListItem>Å huske dine preferanser</ListItem>
            <ListItem>Å sikre at nettstedet fungerer korrekt</ListItem>
          </List>

          <Subtitle>Dine rettigheter</Subtitle>
          <TextBlock>
            I henhold til GDPR har du rett til:
          </TextBlock>
          <List>
            <ListItem>Å få tilgang til dine personopplysninger</ListItem>
            <ListItem>Å rette feilaktige opplysninger</ListItem>
            <ListItem>Å slette dine opplysninger</ListItem>
            <ListItem>Å begrense behandlingen av dine data</ListItem>
            <ListItem>Å overføre dine data</ListItem>
          </List>

          <Subtitle>Kontakt oss</Subtitle>
          <ContactInfo>
            Hvis du har spørsmål om personvern eller ønsker å utøve dine rettigheter, 
            kan du kontakte oss på: <strong>personvern@berge-hyttene.no</strong>
          </ContactInfo>
          
          <TextBlock>
            Sist oppdatert: {new Date().toLocaleDateString('nb-NO')}
          </TextBlock>
        </ContentSection>
      </PageContainer>
      <Footer />
    </>
  );
}
