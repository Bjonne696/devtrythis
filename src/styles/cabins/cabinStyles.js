import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  ResponsiveGrid,
  CardBase,
  FormFieldBase,
  LabelBase,
  InputBase,
  TextAreaBase,
  Button as BaseButton,
  colors,
  spacing,
  borderRadius,
  typography,
  media
} from '../common/index.js';

// Common cabin grid and card styles
export const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 270px));
  gap: 1.5rem;
  margin: 2rem auto;
  max-width: 1200px;
  padding: 0 ${spacing.md};
  justify-content: center;
  width: 100%;

  @media (max-width: 600px) {
    grid-template-columns: 270px;
    justify-content: center;
  }
`;

export const CabinLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export const CabinCard = styled(CardBase)`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 270px;
  height: 400px;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  &:hover::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid ${colors.primary};
    border-radius: ${borderRadius.xl};
    pointer-events: none;
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

export const CabinImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.3s ease;
  flex-shrink: 0;

  ${CabinCard}:hover & {
    transform: scale(1.02);
  }
`;

export const CabinInfo = styled.div`
  padding: ${spacing.md};
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const CabinTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: ${typography.fontWeights.semibold};
  margin: 0 0 ${spacing.sm} 0;
  color: ${colors.text};
  transition: color 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${CabinCard}:hover & {
    color: ${colors.accent};
  }
`;

export const CabinLocation = styled.p`
  font-size: 0.9rem;
  color: ${colors.textLight};
  margin: 0 0 ${spacing.sm} 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CabinPrice = styled.p`
  font-weight: ${typography.fontWeights.semibold};
  font-size: 1rem;
  color: ${colors.text};
  margin: 0;
`;

export const RatingStars = styled.div`
  color: ${colors.orange};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  margin-top: ${spacing.sm};

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

export const RatingSpan = styled.span`
  margin-left: 8px;
  color: #444;
  font-size: 1rem;
`;

// Carousel specific styles
export const CarouselWrapper = styled.div`
  position: relative;
  overflow: hidden;
  margin-top: ${spacing.xl};
  height: 450px;

  @media (max-width: 768px) {
    height: 420px;
  }

  @media (max-width: 480px) {
    height: 420px;
  }
`;

export const CarouselInner = styled.div`
  position: relative;
  height: 100%;
`;

export const CarouselCabinCard = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 270px;
  height: 400px;
  transform: translate(-50%, -50%) scale(0.1);
  opacity: 0;
  z-index: 0;
  transition: all 0.4s ease-in-out;
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  background-color: ${colors.white};
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  ${props => props.$position === 'left-2' && css`
    transform: translate(-200%, -50%) scale(0.7);
    z-index: 1;
    opacity: 0.3;
  `}

  ${props => props.$position === 'left-1' && css`
    transform: translate(-120%, -50%) scale(0.8);
    z-index: 2;
    opacity: 0.6;
  `}

  ${props => props.$position === 'main' && css`
    transform: translate(-50%, -50%) scale(1);
    z-index: 3;
    opacity: 1;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  `}

  ${props => props.$position === 'right-1' && css`
    transform: translate(20%, -50%) scale(0.8);
    z-index: 2;
    opacity: 0.6;
  `}

  ${props => props.$position === 'right-2' && css`
    transform: translate(100%, -50%) scale(0.7);
    z-index: 1;
    opacity: 0.3;
  `}
`;

export const CarouselImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  flex-shrink: 0;
`;

export const CarouselInfo = styled.div`
  padding: ${spacing.md};
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

export const CarouselTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.text};
  margin: 0 0 ${spacing.sm} 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CarouselLocation = styled.p`
  font-size: 0.9rem;
  color: ${colors.textLight};
  margin: 0 0 ${spacing.sm} 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CarouselPrice = styled.p`
  font-weight: ${typography.fontWeights.semibold};
  font-size: 1rem;
  color: ${colors.text};
  margin: 0;
`;

export const CarouselControls = styled.div`
  position: absolute;
  bottom: ${spacing.xl};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: ${spacing.md};
`;

export const CarouselButton = styled(BaseButton)`
  background-color: ${colors.white};
  border: 2px solid ${colors.primary};
  border-radius: ${borderRadius.full};
  width: 50px;
  height: 50px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSizes.lg};
  color: ${colors.primary};

  &:hover:not(:disabled) {
    background-color: ${colors.primary};
    color: ${colors.white};
  }
`;


export const PrevButton = styled(BaseButton)`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid ${colors.primary};
  color: ${colors.primary};
  font-size: ${typography.fontSizes.xl};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.full};
  z-index: 10;

  &:hover:not(:disabled) {
    background-color: ${colors.primary};
    color: ${colors.white};
  }
`;

export const NextButton = styled(BaseButton)`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid ${colors.primary};
  color: ${colors.primary};
  font-size: ${typography.fontSizes.xl};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.full};
  z-index: 10;

  &:hover:not(:disabled) {
    background-color: ${colors.primary};
    color: ${colors.white};
  }
`;

// Cabin details page styles
export const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const RatingSection = styled.div`
  margin: ${spacing.md} 0;
  padding: ${spacing.md};
  background-color: ${colors.white};
  border-radius: ${borderRadius.base};
  border: 1px solid ${colors.border};
`;

export const BookingButton = styled(BaseButton)`
  background: linear-gradient(135deg, ${colors.primary} 0%, #3a2b26 100%);
  color: ${colors.white};
  border: none;
  padding: ${spacing.md} ${spacing.lg};
  font-size: ${typography.fontSizes.base};
  font-weight: ${typography.fontWeights.semibold};
  border-radius: ${borderRadius.base};
  margin-top: ${spacing.lg};
  box-shadow: 0 4px 12px rgba(75, 56, 50, 0.25);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
  align-self: flex-start;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #3a2b26 0%, #2d1f1a 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(75, 56, 50, 0.35);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

export const FacilitiesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-top: 1rem;
`;

export const FacilityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm};
  background-color: #f9f6f0;
  border-radius: ${borderRadius.base};
  border: 1px solid #e0e0e0;

  .facility-icon {
    font-size: ${typography.fontSizes.lg};
  }

  .facility-name {
    font-size: ${typography.fontSizes.sm};
    color: ${colors.text};
    font-weight: ${typography.fontWeights.medium};
  }
`;

// Cabin images styles
export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
  justify-content: start;
`;

export const ThumbnailImage = styled.img`
  width: 100%;
  height: 230px;
  object-fit: cover;
  border-radius: ${borderRadius.sm};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
`;

export const ImageModal = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90%;
  background-color: ${colors.white};
  border-radius: ${borderRadius.sm};
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

export const ModalImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

export const CloseButton = styled(BaseButton)`
  position: absolute;
  top: 10px;
  right: 15px;
  background: rgba(0, 0, 0, 0.5);
  color: ${colors.white};
  border: none;
  font-size: ${typography.fontSizes['2xl']};
  z-index: 1001;
  border-radius: ${borderRadius.full};
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.7);
  }
`;

// Cabin map styles
export const MapWrapper = styled.div`
  margin-top: ${spacing['2xl']};
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
`;

export const GoogleMapsLink = styled(BaseButton)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: ${colors.white};
  border: 2px solid ${colors.primary};
  color: ${colors.primary};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.base};
  font-weight: ${typography.fontWeights.semibold};
  font-size: ${typography.fontSizes.sm};
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover:not(:disabled) {
    background-color: ${colors.primary};
    color: ${colors.white};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

// Cabin owner styles
export const OwnerInfo = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f9f6f0;
  border-radius: 0.75rem;
  border: 1px solid #e0e0e0;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const OwnerPlaceholder = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ccc;
`;

export const OwnerDetails = styled.div`
  p {
    margin: 0.25rem 0;
    color: #4b3832;

    strong {
      font-weight: 600;
    }
  }
`;

// MyCabins component styles - updated for consistency
export const MyCabinsGrid = styled(ResponsiveGrid)`
  margin: ${spacing.xl} 0;
`;

export const MyCabinCard = styled(CardBase)`
  display: flex;
  flex-direction: column;
`;

export const MyCabinImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

export const MyCabinInfo = styled.div`
  padding: ${spacing.md};
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

export const MyCabinTitle = styled.h3`
  font-size: ${typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.text};
  margin: 0;
`;

export const MyCabinLocation = styled.p`
  font-size: ${typography.fontSizes.sm};
  color: ${colors.textLight};
  margin: 0;
`;

export const MyCabinPrice = styled.p`
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.text};
  margin: 0;
`;

export const DeleteButton = styled(BaseButton)`
  background-color: #dc3545;
  color: ${colors.white};
  margin-top: auto;

  &:hover:not(:disabled) {
    background-color: #c82333;
  }
`;

// New cabin form styles
export const FormWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${spacing.xl};
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: 0 4px 20px rgba(75, 56, 50, 0.08);

  h1 {
    font-family: ${typography.fontFamilyHeading};
    color: ${colors.text};
    margin-bottom: ${spacing.xl};
    text-align: center;
  }
`;

export const FormField = styled(FormFieldBase)``;

export const Label = styled(LabelBase)``;

export const Input = styled(InputBase)``;

export const TextArea = styled(TextAreaBase)``;

export const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing.md};

  label {
    display: flex;
    align-items: center;
    gap: ${spacing.sm};
    cursor: pointer;
    font-size: ${typography.fontSizes.sm};

    input[type="checkbox"] {
      width: auto;
    }
  }
`;

export const SubmitButton = styled(BaseButton)`
  background-color: ${colors.primary};
  color: ${colors.white};
  width: 100%;
  padding: ${spacing.lg} ${spacing.xl};
  font-size: ${typography.fontSizes.lg};
  margin-top: ${spacing.xl};

  &:hover:not(:disabled) {
    background-color: ${colors.primaryHover};
  }
`;