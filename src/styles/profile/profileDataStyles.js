import styled from 'styled-components';
import { 
  FormFieldBase,
  LabelBase,
  InputBase,
  Button as BaseButton,
  ErrorMessage as BaseErrorMessage,
  SuccessMessage as BaseSuccessMessage,
  colors,
  spacing,
  borderRadius,
  typography,
  media
} from '../common/index.js';

export const ProfileWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: ${spacing.xl};
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: 0 4px 20px rgba(75, 56, 50, 0.08);
`;

export const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: ${spacing.xl};

  h1 {
    font-family: ${typography.fontFamilyHeading};
    font-size: ${typography.fontSizes['2xl']};
    color: ${colors.text};
    margin-bottom: ${spacing.md};
  }

  p {
    color: ${colors.textLight};
    font-size: ${typography.fontSizes.base};
  }
`;

export const FormSection = styled.section`
  margin-bottom: ${spacing['2xl']};

  h2 {
    font-family: ${typography.fontFamilyHeading};
    font-size: ${typography.fontSizes.xl};
    color: ${colors.text};
    margin-bottom: ${spacing.lg};
    border-bottom: 2px solid ${colors.border};
    padding-bottom: ${spacing.sm};
  }
`;

export const FormField = styled(FormFieldBase)``;

export const Label = styled(LabelBase)``;

export const Input = styled(InputBase)``;

export const TextArea = styled.textarea`
  width: 100%;
  padding: ${spacing.md};
  font-size: ${typography.fontSizes.base};
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.base};
  font-family: ${typography.fontFamily};
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }

  &::placeholder {
    color: ${colors.textMuted};
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.md};
  justify-content: flex-end;

  ${media.md} {
    justify-content: stretch;
    flex-direction: column;
  }
`;

export const Button = styled(BaseButton)`
  ${props => props.$variant === 'primary' && `
    background-color: ${colors.primary};
    color: ${colors.white};
    &:hover:not(:disabled) { background-color: ${colors.primaryHover}; }
  `}

  ${props => props.$variant === 'secondary' && `
    background-color: #6c757d;
    color: ${colors.white};
    &:hover:not(:disabled) { background-color: #545b62; }
  `}
`;

export const SuccessMessage = styled(BaseSuccessMessage)``;

export const ErrorMessage = styled(BaseErrorMessage)``;

export const HelpText = styled.p`
  color: ${colors.textLight};
  font-size: ${typography.fontSizes.sm};
  margin-top: ${spacing.xs};
  font-style: italic;
`;

export const ActionButton = styled(BaseButton)`
  background-color: ${colors.primary};
  color: ${colors.white};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: ${colors.primaryHover};
    transform: translateY(-2px);
  }
`;

export const DangerZone = styled.div`
  border: 2px solid #dc3545;
  border-radius: ${borderRadius.base};
  padding: ${spacing.lg};
  margin-top: ${spacing.xl};
  background-color: #fff5f5;

  h3 {
    color: #dc3545;
    margin-bottom: ${spacing.md};
    font-size: ${typography.fontSizes.lg};
  }

  p {
    color: ${colors.textLight};
    margin-bottom: ${spacing.md};
    font-size: ${typography.fontSizes.sm};
  }
`;

export const DangerButton = styled(BaseButton)`
  background-color: #dc3545;
  color: ${colors.white};

  &:hover:not(:disabled) {
    background-color: #c82333;
  }
`;