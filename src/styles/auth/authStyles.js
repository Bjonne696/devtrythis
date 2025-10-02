import styled from 'styled-components';
import { Button as BaseButton, colors, spacing, borderRadius, typography, media } from '../common/index.js';

export const Button = styled(BaseButton)`
  ${props => props.$variant === 'primary' && `
    background-color: ${colors.primary};
    color: ${colors.white};
    &:hover:not(:disabled) { background-color: ${colors.primaryHover}; }
  `}

  ${props => props.$variant === 'secondary' && `
    background-color: ${colors.secondary};
    color: ${colors.white};
    &:hover:not(:disabled) { background-color: #545b62; }
  `}
`;

export const AuthWrapper = styled.div`
  background-color: ${colors.white};
  padding: ${spacing['2xl']};
  border-radius: ${borderRadius.lg};
  box-shadow: 0 8px 32px rgba(75, 56, 50, 0.1);
  width: 100%;
  max-width: 400px;

  ${media.md} {
    padding: ${spacing.xl};
    max-width: 350px;
  }
`;

export const AuthTitle = styled.h1`
  font-family: ${typography.fontFamilyHeading};
  font-size: ${typography.fontSizes['2xl']};
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.text};
  text-align: center;
  margin-bottom: ${spacing.xl};

  ${media.md} {
    font-size: ${typography.fontSizes.xl};
  }
`;