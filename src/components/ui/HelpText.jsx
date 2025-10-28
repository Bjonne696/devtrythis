import React from 'react';
import {
  HelpTextContainer,
  HelpIcon,
  HelpContent
} from '../../styles/ui/helpTextStyles';

export default function HelpText({ children, icon = "💡" }) {
  return (
    <HelpTextContainer>
      <HelpIcon>{icon}</HelpIcon>
      <HelpContent>
        {children}
      </HelpContent>
    </HelpTextContainer>
  );
}
