import React, { useState } from 'react';
import {
  TooltipWrapper,
  TooltipContent,
  TooltipIcon
} from '../../styles/ui/tooltipStyles';

export default function Tooltip({ children, text, icon = "?" }) {
  const [visible, setVisible] = useState(false);

  return (
    <TooltipWrapper
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <TooltipIcon>{icon}</TooltipIcon>
      <TooltipContent $visible={visible}>
        {text}
      </TooltipContent>
    </TooltipWrapper>
  );
}
