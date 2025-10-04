
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
            <ListItem>Abonnementsdata for hytteeiere (status, plan, betalingshistorikk)</ListItem>
            <ListItem>Tekniske data som IP-adresse og nettleserinfo</ListItem>
          </List>

          <Subtitle>Hvordan bruker vi informasjonen?</Subtitle>
          <List>
            <ListItem>For å administrere bookinger og utleie</ListItem>
            <ListItem>For å behandle abonnementer og betalinger for hytteeiere</ListItem>
            <ListItem>For å kommunisere med deg om dine bookinger og abonnement</ListItem>
            <ListItem>For å forbedre våre tjenester</ListItem>
            <ListItem>For å oppfylle juridiske forpliktelser (inkludert regnskapslov)</ListItem>
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

          <Subtitle>Betalinger og Abonnementer</Subtitle>
          <TextBlock>
            For hytteeiere som bruker vår abonnementstjeneste:
          </TextBlock>
          <List>
            <ListItem>Betalinger behandles av Vipps MobilePay, en tredjeparts betalingsleverandør</ListItem>
            <ListItem>Vi lagrer IKKE kortinformasjon eller sensitive betalingsdetaljer</ListItem>
            <ListItem>Vi lagrer kun abonnementsstatus, betalingshistorikk (dato, beløp), og leverandør-ID</ListItem>
            <ListItem>Betalingsdata brukes kun for å administrere abonnementet ditt og oppfylle juridiske krav</ListItem>
            <ListItem>Vipps MobilePay har sitt eget personvernreglement som regulerer behandling av betalingsdata</ListItem>
          </List>
          <TextBlock>
            <strong>Datalagring:</strong> Abonnementsdata lagres så lenge abonnementet er aktivt og i 
            5 år etter kansellering for regnskapsmessige formål. Du kan når som helst be om en kopi 
            av dine betalingsdata eller sletting etter lovpålagt lagringsperiode.
          </TextBlock>

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
