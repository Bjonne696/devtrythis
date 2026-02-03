import React, { useState, useEffect } from 'react';
import {
  HelpTextContainer,
  HelpIcon,
  HelpContent,
  CloseButton
} from '../../styles/ui/helpTextStyles';

export default function HelpText({ children, icon = "💡", id }) {
  const storageKey = id ? `helptext_dismissed_${id}` : null;
  
  const [isDismissed, setIsDismissed] = useState(() => {
    if (!storageKey) return false;
    return sessionStorage.getItem(storageKey) === 'true';
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    if (storageKey) {
      sessionStorage.setItem(storageKey, 'true');
    }
  };

  if (isDismissed) return null;

  return (
    <HelpTextContainer>
      <HelpIcon>{icon}</HelpIcon>
      <HelpContent>
        {children}
      </HelpContent>
      <CloseButton onClick={handleDismiss} aria-label="Lukk">
        ×
      </CloseButton>
    </HelpTextContainer>
  );
}
