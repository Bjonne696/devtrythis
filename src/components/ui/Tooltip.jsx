
import React, { useState } from 'react';
import styled from 'styled-components';

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: help;
`;

const TooltipContent = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #2c3e50;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  white-space: nowrap;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 0.5rem;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: all 0.2s ease;
  max-width: 250px;
  white-space: normal;
  text-align: center;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #2c3e50;
  }
`;

const TooltipIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #4b3832;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
  cursor: help;
`;

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
