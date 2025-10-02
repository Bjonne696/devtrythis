import styled from "styled-components";
import { 
  PageWrapper,
  MainContent,
  Button as BaseButton,
  colors,
  spacing,
  borderRadius,
  typography,
  media,
  breakpoints
} from '../common/index.js';

export const PopularPageWrapper = styled(PageWrapper)``;

export const PopularMainContent = styled(MainContent)`
  max-width: ${breakpoints.xl};
`;

export const ResultsText = styled.p`
  text-align: center;
  color: ${colors.text};
  font-size: ${typography.fontSizes.lg};
  margin-bottom: ${spacing.lg};
`;

export const PageButton = styled(BaseButton)`
  padding: ${spacing.sm} ${spacing.lg};
  border: 2px solid ${colors.text};
  background-color: ${props => props.$active ? colors.secondary : colors.white};
  color: ${props => props.$active ? colors.white : colors.text};
  border-radius: ${borderRadius.base};
  font-weight: ${typography.fontWeights.medium};

  &:hover:not(:disabled) {
    background-color: ${props => props.$active ? colors.secondary : '#f0f0f0'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;