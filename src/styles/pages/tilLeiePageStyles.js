
import styled from "styled-components";
import {
  PageWrapper as BasePageWrapper,
  MainContent as BaseMainContent,
  InputBase,
  ButtonBase,
  LoadingSpinner as BaseLoadingSpinner,
  ErrorMessage as BaseErrorMessage,
  ResponsiveGrid,
  CardBase,
  colors,
  spacing,
  typography,
  media,
  borderRadius
} from '../common/index.js';

export const PageWrapper = styled(BasePageWrapper)``;

export const MainContent = styled(BaseMainContent)``;

export const TilLeieSearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: ${spacing['2xl']} 0;
  padding: 0 ${spacing['2xl']};
  gap: ${spacing.lg};
`;

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: ${spacing['3xl']} auto;
  padding: ${spacing['2xl']};
  gap: ${spacing.xl};
  max-width: 1000px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: ${borderRadius.xl};
  box-shadow: 0 8px 32px rgba(75, 56, 50, 0.1);
  backdrop-filter: blur(10px);
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  ${media.lg} {
    margin: ${spacing['2xl']} ${spacing.lg};
    padding: ${spacing.xl};
    max-width: 95%;
  }

  ${media.md} {
    margin: ${spacing['2xl']} ${spacing.lg};
    padding: ${spacing.xl};
    gap: ${spacing.lg};
    border-radius: ${borderRadius.lg};
  }

  ${media.sm} {
    margin: ${spacing.xl} ${spacing.sm};
    padding: ${spacing.lg};
    gap: ${spacing.md};
  }
`;

export const SearchInput = styled(InputBase)`
  width: 100%;
  max-width: 600px;
  padding: ${spacing.lg} ${spacing.xl};
  font-size: ${typography.fontSizes.lg};
  border: 2px solid rgba(75, 56, 50, 0.2);
  border-radius: ${borderRadius.full};
  background-color: ${colors.white};
  box-shadow: 0 4px 15px rgba(75, 56, 50, 0.05);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 6px 25px rgba(75, 56, 50, 0.15);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: rgba(75, 56, 50, 0.5);
    font-weight: 400;
  }
`;

export const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.lg};
  align-items: center;
  justify-content: center;
  max-width: 800px;
  width: 100%;
  margin-top: ${spacing.lg};

  ${media.md} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  min-width: 150px;
`;

export const FilterLabel = styled.label`
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.primary};
`;

export const PriceRangeContainer = styled.div`
  display: flex;
  gap: ${spacing.sm};
  align-items: center;
`;

export const PriceInput = styled(InputBase)`
  width: 80px;
  padding: ${spacing.sm};
  font-size: ${typography.fontSizes.sm};
`;

export const FacilitiesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.sm};
  margin-top: ${spacing.sm};
`;

export const FacilityCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${props => props.$checked ? colors.primary : colors.white};
  color: ${props => props.$checked ? colors.white : colors.primary};
  border: 1px solid ${colors.primary};
  border-radius: ${borderRadius.base};
  cursor: pointer;
  font-size: ${typography.fontSizes.sm};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$checked ? colors.primaryHover : '#f5f5f5'};
  }

  input {
    display: none;
  }
`;

export const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  margin-top: ${spacing.sm};
  flex-wrap: wrap;
`;

export const DateInput = styled(InputBase)`
  padding: ${spacing.md};
  border: 2px solid ${colors.primary};
  border-radius: ${borderRadius.base};
  font-size: ${typography.fontSizes.sm};
  background-color: ${colors.white};
  color: ${colors.primary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${colors.secondary};
    box-shadow: 0 0 0 3px rgba(117, 133, 146, 0.1);
  }
`;

export const DateSeparator = styled.span`
  color: ${colors.primary};
  font-weight: ${typography.fontWeights.medium};
  font-size: ${typography.fontSizes.sm};
`;

export const ClearFiltersButton = styled(ButtonBase)`
  padding: ${spacing.sm} ${spacing.lg};
  background-color: #f5f5f5;
  border: 1px solid ${colors.border};
  color: ${colors.textLight};

  &:hover {
    background-color: #e0e0e0;
  }
`;

export const LoadingSpinner = styled(BaseLoadingSpinner)`
  height: 200px;
  font-size: ${typography.fontSizes.lg};
  color: ${colors.primary};
`;

export const ErrorMessage = styled(BaseErrorMessage)`
  height: 200px;
  font-size: ${typography.fontSizes.lg};
  margin: ${spacing['2xl']} 0;
`;

export const SearchResultsSection = styled.div`
  margin-top: ${spacing['2xl']};
`;

export const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: ${spacing['2xl']};
  color: ${colors.primary};
  font-family: ${typography.fontFamilyHeading};
  font-size: ${typography.fontSizes['2xl']};
`;

export const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const CabinCard = styled(CardBase)`
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 480px) {
    &:hover {
      transform: none;
    }
  }
`;

export const CabinImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;

  @media (max-width: 768px) {
    height: 180px;
  }

  @media (max-width: 480px) {
    height: 160px;
  }
`;

export const CabinInfo = styled.div`
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

export const CabinTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: ${typography.fontWeights.semibold};
  margin: 0 0 ${spacing.sm} 0;
  color: ${colors.primary};
  font-family: ${typography.fontFamilyHeading};

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const CabinLocation = styled.p`
  font-size: 0.9rem;
  color: ${colors.textLight};
  margin: 0 0 ${spacing.sm} 0;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

export const CabinPrice = styled.p`
  font-weight: ${typography.fontWeights.semibold};
  font-size: 1rem;
  color: ${colors.primary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

export const RatingStars = styled.div`
  color: ${colors.orange};
  font-size: 0.9rem;
  margin-top: ${spacing.sm};

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${spacing.lg};
  margin: ${spacing['2xl']} 0;
`;

export const PaginationButton = styled(ButtonBase)`
  padding: ${spacing.sm} ${spacing.lg};
  border: 2px solid ${colors.primary};
  background-color: ${props => props.$active ? colors.primary : colors.white};
  color: ${props => props.$active ? colors.white : colors.primary};
  border-radius: ${borderRadius.base};

  &:hover {
    background-color: ${colors.primary};
    color: ${colors.white};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const NoResults = styled.p`
  text-align: center;
  color: ${colors.textLight};
  font-size: ${typography.fontSizes.lg};
  margin: ${spacing['2xl']} 0;
`;
