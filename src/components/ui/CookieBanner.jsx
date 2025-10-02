
import { useState, useEffect } from 'react';
import { 
  BannerContainer, 
  BannerContent, 
  BannerText, 
  ButtonGroup, 
  AcceptButton, 
  CloseButton,
  PolicyLink 
} from '../../styles/ui/cookieBannerStyles';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('gdpr-consent');
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gdpr-consent', 'accepted');
    setIsVisible(false);
  };

  const handleClose = () => {
    localStorage.setItem('gdpr-consent', 'dismissed');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <BannerContainer>
      <BannerContent>
        <BannerText>
          Vi bruker informasjonskapsler for å gi deg en bedre opplevelse på vårt nettsted. 
          Ved å fortsette å bruke siden godtar du vår bruk av cookies for grunnleggende 
          funksjonalitet som innlogging og preferanser. 
          <PolicyLink href="/personvern">Les mer om personvern</PolicyLink>
        </BannerText>
        <ButtonGroup>
          <CloseButton onClick={handleClose}>
            Lukk
          </CloseButton>
          <AcceptButton onClick={handleAccept}>
            Godta cookies
          </AcceptButton>
        </ButtonGroup>
      </BannerContent>
    </BannerContainer>
  );
}
