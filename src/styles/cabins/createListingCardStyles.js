import styled from 'styled-components';
import { CarouselCabinCard } from './cabinStyles.js';
import { 
  colors,
  spacing,
  borderRadius,
  typography
} from '../common/index.js';

export const CreateListingCardWrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 270px;
  height: 400px;
  box-sizing: border-box;
  background: linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.background} 100%);
  border-radius: ${borderRadius.xl};
  border: 2px dashed ${colors.primary};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    border-style: solid;
    background: linear-gradient(135deg, ${colors.background} 0%, ${colors.primaryLight} 100%);
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 270px;
    height: 400px;
    margin: 0 auto;

    &:hover {
      transform: none;
    }
  }
`;

export const CreateListingIconSection = styled.div`
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(75, 56, 50, 0.05);
  flex-shrink: 0;
`;

export const CreateListingIcon = styled.div`
  font-size: 4rem;
  color: ${colors.primary};
  opacity: 0.7;
  transition: all 0.3s ease;

  ${CreateListingCardWrapper}:hover & {
    opacity: 1;
    transform: scale(1.1);
  }
`;

export const CreateListingInfo = styled.div`
  padding: ${spacing.md} ${spacing.lg} ${spacing.xl};
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
`;

export const CreateListingTitle = styled.h3`
  font-size: 1rem;
  font-weight: ${typography.fontWeights.semibold};
  margin: 0 0 ${spacing.xs} 0;
  color: ${colors.primary};
  font-family: ${typography.fontFamilyHeading};
`;

export const CreateListingDescription = styled.p`
  font-size: 0.8rem;
  color: ${colors.textLight};
  margin: 0;
  line-height: 1.4;
`;

export const CreateListingCTA = styled.span`
  display: inline-block;
  margin-top: auto;
  padding: ${spacing.sm} ${spacing.lg};
  background-color: ${colors.primary};
  color: ${colors.white};
  border-radius: ${borderRadius.base};
  font-size: 0.85rem;
  font-weight: ${typography.fontWeights.medium};
  transition: all 0.2s ease;

  ${CreateListingCardWrapper}:hover & {
    background-color: ${colors.primaryHover};
  }
`;

export const CreateListingCarouselCard = styled(CarouselCabinCard)`
  cursor: pointer;
  border: 2px dashed ${colors.primary};
  background: linear-gradient(135deg, #f5f0ed 0%, #faf8f6 100%);

  &:hover {
    border-style: solid;
    background: linear-gradient(135deg, #faf8f6 0%, #f5f0ed 100%);
  }
`;
