import styled from 'styled-components';
import {
  Button as BaseButton, // Changed from Button as BaseButton to Button to match the styled(Button) usage
  colors,
  spacing,
  borderRadius,
  typography,
  media,
  buttonVariants // Added to import for RetryButton styling
} from '../common/index.js';

export const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: ${spacing['2xl']};
  background-color: ${colors.errorBackground};
  border: 1px solid ${colors.errorBorder};
  border-radius: ${borderRadius.lg};
  margin: ${spacing.xl} auto;
  max-width: 600px;
  text-align: center;
`;

export const ErrorTitle = styled.h2`
  font-family: ${typography.fontFamilyHeading};
  font-size: ${typography.fontSizes['2xl']};
  color: ${colors.error};
  margin-bottom: ${spacing.lg};
`;

export const ErrorMessage = styled.div`
  color: ${colors.danger};
  font-size: ${typography.fontSizes.sm};
  margin-bottom: ${spacing.md};
  text-align: center;
`;

export const RetryButton = styled(BaseButton)`
  background-color: ${colors.primary};
  color: ${colors.white};
  margin-top: ${spacing.md};

  &:hover:not(:disabled) {
    background-color: ${colors.primaryHover};
  }
`;