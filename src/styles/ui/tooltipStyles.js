
import styled from 'styled-components';
import { 
  colors,
  spacing,
  borderRadius,
  typography
} from '../common/index.js';

export const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const TooltipTrigger = styled.div`
  cursor: help;
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
`;

export const TooltipIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background-color: ${colors.primary};
  color: ${colors.white};
  border-radius: 50%;
  font-size: ${typography.fontSizes.xs};
  font-weight: ${typography.fontWeights.bold};
`;

export const TooltipContent = styled.div`
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${colors.text};
  color: ${colors.white};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.base};
  font-size: ${typography.fontSizes.sm};
  line-height: ${typography.lineHeights.normal};
  white-space: nowrap;
  max-width: 300px;
  white-space: normal;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: ${colors.text};
  }
  
  ${props => !props.$visible && `
    display: none;
  `}
`;
