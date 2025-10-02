
import styled from 'styled-components';
import { 
  CardBase,
  Button as BaseButton,
  colors,
  spacing,
  borderRadius,
  typography,
  media
} from '../common/index.js';

export const RequestsWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing['2xl']} ${spacing.lg};
  background-color: ${colors.background};
  min-height: 100vh;

  ${media.md} {
    padding: ${spacing.xl} ${spacing.md};
  }
`;

export const RequestsGrid = styled.div`
  display: grid;
  gap: ${spacing.xl};
  margin-bottom: ${spacing.xl};

  ${media.md} {
    gap: ${spacing.lg};
  }
`;

export const RequestCard = styled(CardBase)`
  padding: ${spacing.xl};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(75, 56, 50, 0.15);
  }
`;

export const RequestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing.lg};

  ${media.md} {
    flex-direction: column;
    gap: ${spacing.md};
  }
`;

export const RequestInfo = styled.div`
  flex: 1;
`;

export const CabinName = styled.h3`
  font-family: ${typography.fontFamilyHeading};
  font-size: ${typography.fontSizes.xl};
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.text};
  margin-bottom: ${spacing.sm};
`;

export const GuestName = styled.p`
  color: ${colors.textLight};
  font-size: ${typography.fontSizes.base};
  margin-bottom: ${spacing.xs};
`;

export const RequestDates = styled.p`
  color: ${colors.text};
  font-weight: ${typography.fontWeights.medium};
  font-size: ${typography.fontSizes.base};
  margin-bottom: ${spacing.sm};
`;

export const RequestMessage = styled.p`
  color: ${colors.textLight};
  font-size: ${typography.fontSizes.sm};
  line-height: ${typography.lineHeights.normal};
  background-color: ${colors.background};
  padding: ${spacing.md};
  border-radius: ${borderRadius.base};
  border-left: 4px solid ${colors.primary};
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: ${spacing.xs} ${spacing.md};
  border-radius: ${borderRadius.full};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.$status) {
      case 'pending':
        return `
          background-color: ${colors.warningBackground};
          color: ${colors.warning};
          border: 1px solid ${colors.warningBorder};
        `;
      case 'approved':
        return `
          background-color: ${colors.successBackground};
          color: ${colors.success};
        `;
      case 'rejected':
        return `
          background-color: ${colors.errorBackground};
          color: ${colors.error};
        `;
      default:
        return `
          background-color: ${colors.background};
          color: ${colors.textLight};
        `;
    }
  }}
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-top: ${spacing.lg};

  ${media.sm} {
    flex-direction: column;
  }
`;

export const ApproveButton = styled(BaseButton)`
  background-color: ${colors.success};
  color: ${colors.white};
  flex: 1;

  &:hover:not(:disabled) {
    background-color: #2e7d32;
  }
`;

export const RejectButton = styled(BaseButton)`
  background-color: ${colors.error};
  color: ${colors.white};
  flex: 1;

  &:hover:not(:disabled) {
    background-color: #c53030;
  }
`;

export const LoadingText = styled.p`
  text-align: center;
  color: ${colors.text};
  font-size: ${typography.fontSizes.lg};
  margin: ${spacing['2xl']} 0;
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
