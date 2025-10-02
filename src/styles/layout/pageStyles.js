import styled from 'styled-components';
import { 
  PageWrapper as BasePageWrapper,
  MainContent as BaseMainContent,
  CenteredMainContent as BaseCenteredMainContent,
  InputBase,
  colors,
  spacing,
  borderRadius,
  typography,
  media,
  breakpoints
} from '../common/index.js';

// Common page wrapper used across all pages
export const PageWrapper = styled(BasePageWrapper)``;

// Main content with light background
export const MainContent = styled(BaseMainContent)``;

// Main content without background (for auth pages)
export const CenteredMainContent = styled(BaseCenteredMainContent)``;

// Common search container
export const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: ${spacing.xl} 0;
  padding: 0 ${spacing.xl};
`;

// Common search input
export const SearchInput = styled(InputBase)`
  max-width: 600px;
  padding: ${spacing.md};
  font-size: ${typography.fontSizes.base};
  border: 2px solid ${colors.primary};
  border-radius: ${borderRadius.full};
  background-color: ${colors.white};

  &:focus {
    outline: none;
    border-color: ${colors.secondary};
  }

  &::placeholder {
    color: ${colors.textMuted};
  }
`;

export const ContentWrapper = styled.div`
  max-width: ${breakpoints.xl};
  margin: 0 auto;
  padding: ${spacing.xl};

  ${media.md} {
    padding: ${spacing.lg} ${spacing.md};
  }
`;

// Common section title
export const SectionTitle = styled.h2`
  font-family: ${typography.fontFamilyHeading};
  font-size: ${typography.fontSizes['2xl']};
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.text};
  text-align: center;
  margin-bottom: ${spacing.xl};

  ${media.md} {
    font-size: ${typography.fontSizes.xl};
    margin-bottom: ${spacing.lg};
  }
`;

// Common pagination
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
`;

export const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid #4b3832;
  background-color: ${props => props.$active ? '#4b3832' : 'white'};
  color: ${props => props.$active ? 'white' : '#4b3832'};
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #4b3832;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Loading and error states
export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${spacing['2xl']};

  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid ${colors.border};
    border-top: 4px solid ${colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #d32f2f;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 0.5rem;
  margin: 2rem 0;
  padding: 1rem;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${spacing['3xl']};
  color: ${colors.textLight};

  h3 {
    font-family: ${typography.fontFamilyHeading};
    font-size: ${typography.fontSizes.xl};
    margin-bottom: ${spacing.md};
    color: ${colors.text};
  }

  p {
    font-size: ${typography.fontSizes.base};
    margin-bottom: ${spacing.xl};
  }
`;

export const NoResults = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin: 2rem 0;
`;