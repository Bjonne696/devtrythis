import React from 'react';
import { PageWrapper, MainContent } from '../styles/layout/pageStyles.js';
import Navigation from '../components/nav/Navigation.jsx';
import Footer from '../components/nav/Footer.jsx';
import {
  OmOssContainer,
  OmOssTitle,
  Section,
  SectionTitle,
  Paragraph,
  ValuesList,
  ValueItem
} from '../styles/pages/omOssPageStyles';

export default function OmOssPage() {
  return (
    <PageWrapper>
      <Navigation />
      <MainContent>
        <OmOssContainer>
          <OmOssTitle>
            Om Oss
          </OmOssTitle>

          <Section>
            <SectionTitle>
              En drøm som blir virkelighet
            </SectionTitle>
            <Paragraph>
              Berge-Hyttene har vært en drøm i over 20 år. Det hele startet med en visjon om å skape
              et sted hvor familier og venner kunne komme sammen, slappe av og nyte Norges fantastiske natur.
            </Paragraph>

            <Paragraph>
              Gjennom årene har denne drømmen vokst og utviklet seg. Vi ønsket ikke bare å tilby
              overnatting, men å skape opplevelser og minner som varer livet ut. Våre hytter ligger
              strategisk plassert på noen av de vakreste stedene i Norge, og hver hytte er nøye
              utvalgt for å gi våre gjester den beste opplevelsen.
            </Paragraph>

            <SectionTitle>
              Vår visjon
            </SectionTitle>
            <Paragraph>
              Vi tror på at de beste øyeblikkene i livet skjer når vi kobler oss fra hverdagens stress
              og kobler oss til naturen og de vi er glad i. Berge-Hyttene skal være ditt andre hjem
              - et sted hvor du kan lade batteriene og skape uforglemmelige øyeblikk.
            </Paragraph>

            <SectionTitle>
              Hva vi tilbyr
            </SectionTitle>
            <Paragraph>
              Våre hytter spenner fra koselige hytter for to personer til store familiehytter som
              kan huse store grupper. Alle hyttene våre er utstyrt med moderne fasiliteter samtidig
              som de bevarer den tradisjonelle norske hyttefølelsen.
            </Paragraph>

            <Paragraph>
              Vi er stolte av å kunne tilby våre gjester autentiske norske hytteopplevelser, og
              vi jobber kontinuerlig for å forbedre våre tjenester og sikre at hver gjest føler
              seg velkommen.
            </Paragraph>

            <SectionTitle>
              Fremtiden
            </SectionTitle>
            <Paragraph>
              Etter 20 år med planlegging og drømming, ser vi frem til mange flere år med å
              tilby uforglemmelige opplevelser. Vi fortsetter å utvide vårt tilbud og finne
              nye, fantastiske steder hvor våre gjester kan oppleve det beste Norge har å tilby.
            </Paragraph>

            <Paragraph style={{ fontStyle: 'italic', marginTop: '2rem', textAlign: 'center' }}>
              Takk for at du velger Berge-Hyttene. Vi ser frem til å være en del av dine minner.
            </Paragraph>
          </Section>
        </OmOssContainer>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}