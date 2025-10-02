
import styled from "styled-components";
import { 
  EmptyState as BaseEmptyState,
  colors,
  spacing,
  typography,
  borderRadius,
  media
} from '../common/index.js';

export const MyCabinsWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing['2xl']} ${spacing.lg};
  background-color: ${colors.background};
  min-height: 100vh;

  ${media.md} {
    padding: ${spacing.xl} ${spacing.md};
  }
`;

export const CabinGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${spacing.xl};
  margin-bottom: ${spacing.xl};

  ${media.lg} {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  ${media.md} {
    grid-template-columns: 1fr;
    gap: ${spacing.lg};
  }
`;

export const CabinCard = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.xl};
  box-shadow: 0 4px 20px rgba(75, 56, 50, 0.08);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(75, 56, 50, 0.15);
  }
`;

export const CabinImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

export const CabinInfo = styled.div`
  padding: ${spacing.lg};
`;

export const CabinTitle = styled.h3`
  font-family: ${typography.fontFamilyHeading};
  font-size: ${typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.text};
  margin-bottom: ${spacing.sm};
`;

export const CabinDescription = styled.p`
  color: ${colors.textLight};
  font-size: ${typography.fontSizes.sm};
  line-height: ${typography.lineHeights.normal};
  margin-bottom: ${spacing.md};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CabinDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.md};
`;

export const Price = styled.span`
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.primary};
  font-size: ${typography.fontSizes.lg};
`;

export const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.textLight};
  font-size: ${typography.fontSizes.sm};
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.sm};

  ${media.sm} {
    flex-direction: column;
  }
`;

export const ViewButton = styled.button`
  flex: 1;
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${colors.primary};
  color: ${colors.white};
  border: none;
  border-radius: ${borderRadius.base};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${colors.primaryHover};
  }
`;

export const DeleteButton = styled.button`
  flex: 1;
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${colors.error};
  color: ${colors.white};
  border: none;
  border-radius: ${borderRadius.base};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c53030;
  }
`;

export const LoadingText = styled.p`
  text-align: center;
  color: ${colors.text};
  font-size: ${typography.fontSizes.lg};
  margin: ${spacing['2xl']} 0;
`;

export const EmptyState = styled(BaseEmptyState)``;
