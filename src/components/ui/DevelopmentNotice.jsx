import React, { useState, useEffect } from 'react';
import {
  NoticeContainer,
  NoticeIcon,
  NoticeContent,
  CloseButton
} from '../../styles/ui/developmentNoticeStyles';

export default function DevelopmentNotice() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('devNoticeDismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('devNoticeDismissed', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <NoticeContainer>
      <NoticeIcon>⚠</NoticeIcon>
      <NoticeContent>
        <h3>Viktig melding - Siden er under utvikling</h3>
        <p>Denne nettsiden er for øyeblikket under bygging og testing. Vær oppmerksom på følgende:</p>
        <ul>
          <li>All data som vises er <strong>mockdata</strong> og fungerer kun for demonstrasjon</li>
          <li>Alle funksjoner er fullt fungerende og blir testet grundig</li>
          <li>Databasen vil bli <strong>fullstendig rensket</strong> før offisiell lansering</li>
          <li>Noen funksjoner kan være under utvikling</li>
        </ul>
        <p>Takk for din tålmodighet mens vi jobber med å gjøre alt klart!</p>
      </NoticeContent>
      <CloseButton onClick={handleClose} aria-label="Lukk varsel">
        ×
      </CloseButton>
    </NoticeContainer>
  );
}
