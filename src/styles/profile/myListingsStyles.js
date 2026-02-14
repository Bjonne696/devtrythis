import styled from 'styled-components';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  media
} from '../common/index.js';

export const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${spacing.xl};

  ${media.md} {
    grid-template-columns: 1fr;
    gap: ${spacing.lg};
  }
`;

export const ListingCard = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.xl};
  box-shadow: 0 4px 20px rgba(75, 56, 50, 0.08);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(75, 56, 50, 0.15);
  }
`;

export const ListingImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

export const ListingImagePlaceholder = styled.div`
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #f0ebe6 0%, #e0d6cc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.textLight};
  font-size: ${typography.fontSizes.sm};
`;

export const ListingBody = styled.div`
  padding: ${spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

export const ListingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${spacing.sm};
`;

export const ListingTitle = styled.h4`
  font-family: ${typography.fontFamilyHeading};
  font-size: ${typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.text};
  margin: 0;
`;

export const ListingLocation = styled.p`
  font-size: ${typography.fontSizes.sm};
  color: ${colors.textLight};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ListingPrice = styled.p`
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.text};
  margin: 0;
  font-size: ${typography.fontSizes.base};
`;

export const SubscriptionBadge = styled.span`
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;

  ${props => {
    switch (props.$status) {
      case 'active':
        return 'background: #d4edda; color: #155724;';
      case 'pending':
        return 'background: #fff3cd; color: #856404;';
      case 'past_due':
        return 'background: #f8d7da; color: #721c24;';
      case 'canceled':
        return 'background: #e2e3e5; color: #383d41;';
      default:
        return 'background: #fce4ec; color: #c62828;';
    }
  }}
`;

export const SubscriptionInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.sm};
  align-items: center;
  font-size: ${typography.fontSizes.sm};
  color: ${colors.textLight};
  margin-top: ${spacing.xs};
`;

export const SubscriptionDetail = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.sm};
  margin-top: ${spacing.md};
  flex-wrap: wrap;
`;

export const ListingButton = styled.button`
  flex: 1;
  min-width: 100px;
  padding: ${spacing.sm} ${spacing.md};
  border: none;
  border-radius: ${borderRadius.base};
  font-weight: ${typography.fontWeights.medium};
  font-size: ${typography.fontSizes.sm};
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${props => {
    switch (props.$variant) {
      case 'danger':
        return `
          background-color: #dc3545;
          color: ${colors.white};
          &:hover:not(:disabled) { background-color: #c82333; }
        `;
      case 'activate':
        return `
          background-color: #667eea;
          color: ${colors.white};
          &:hover:not(:disabled) { background-color: #5568d3; }
        `;
      case 'view':
        return `
          background-color: ${colors.primary};
          color: ${colors.white};
          &:hover:not(:disabled) { background-color: ${colors.primaryHover}; }
        `;
      default:
        return `
          background-color: ${colors.primary};
          color: ${colors.white};
          &:hover:not(:disabled) { background-color: ${colors.primaryHover}; }
        `;
    }
  }}
`;

export const EmptyListings = styled.div`
  text-align: center;
  padding: ${spacing['2xl']};
  color: ${colors.textLight};

  p {
    font-size: ${typography.fontSizes.base};
    margin-bottom: ${spacing.md};
  }
`;

export const LoadingText = styled.p`
  text-align: center;
  color: ${colors.textLight};
  padding: ${spacing.xl};
`;

export const ConfirmOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${spacing.md};
`;

export const ConfirmDialog = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.xl};
  max-width: 420px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;

  h4 {
    color: ${colors.text};
    margin: 0 0 ${spacing.md} 0;
    font-size: ${typography.fontSizes.lg};
  }

  p {
    color: ${colors.textLight};
    margin: 0 0 ${spacing.lg} 0;
    font-size: ${typography.fontSizes.base};
    line-height: 1.5;
  }
`;

export const ConfirmButtons = styled.div`
  display: flex;
  gap: ${spacing.sm};
  justify-content: center;
`;

export const ActionMessage = styled.div`
  padding: 0.6rem;
  border-radius: ${borderRadius.base};
  margin-top: ${spacing.sm};
  font-size: ${typography.fontSizes.sm};

  ${props => {
    if (props.$type === 'error') {
      return `
        background: #fee;
        color: #c33;
        border-left: 3px solid #c33;
      `;
    }
    if (props.$type === 'success') {
      return `
        background: #d4edda;
        color: #155724;
        border-left: 3px solid #28a745;
      `;
    }
    return '';
  }}
`;
