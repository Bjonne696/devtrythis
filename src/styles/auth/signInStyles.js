import styled from "styled-components";
import {
  FormFieldBase,
  LabelBase,
  InputBase,
  ButtonBase,
  colors,
  spacing,
  borderRadius,
  typography
} from '../common/index.js';

export const SignInWrapper = styled.div`
  max-width: 400px;
  margin: ${spacing['2xl']} auto;
  padding: ${spacing['2xl']};
  background: rgba(255, 255, 255, 0.95);
  border-radius: ${borderRadius.xl};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

export const Heading = styled.h1`
  text-align: center;
  color: ${colors.text};
  margin-bottom: ${spacing['2xl']};
  font-size: ${typography.fontSizes['3xl']};
  font-family: ${typography.fontFamilyHeading};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

export const LabelGroup = styled(FormFieldBase)`
  gap: ${spacing.sm};
`;

export const Label = styled(LabelBase)`
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.text};
  font-size: ${typography.fontSizes.sm};
`;

export const Input = styled(InputBase)`
  border: 2px solid ${props => props.$hasError ? '#d32f2f' : '#e0e0e0'};
  
  &:focus {
    border-color: ${colors.primary};
  }
`;

export const Button = styled(ButtonBase)`
  background-color: rgba(255, 255, 255, 0.9);
  color: ${colors.primary};
  border: 2px solid ${colors.primary};
  border-radius: ${borderRadius.full};
  backdrop-filter: blur(5px);

  &:hover:not(:disabled) {
    background-color: #4e5d5d;
    color: ${colors.white};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    transform: none;
  }
`;

export const Error = styled.div`
  color: ${colors.error};
  font-size: ${typography.fontSizes.sm};
  margin-top: ${spacing.xs};
`;

export const FieldError = styled(Error)`
  font-size: 0.8rem;
  margin: 0.25rem 0 0 0;
`;

export const ToggleText = styled.p`
  text-align: center;
  margin-top: ${spacing.md};
  color: ${colors.textLight};
`;

export const ToggleLink = styled.button`
  background: none;
  border: none;
  color: ${colors.primary};
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;

  &:hover {
    color: ${colors.primaryHover};
  }
`;

export const ForgotPasswordButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primary};
  font-size: ${typography.fontSizes.sm};
  cursor: pointer;
  text-decoration: underline;
  margin-bottom: ${spacing.sm};
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.secondary};
  }
`;

export const RegisterInfo = styled.p`
  color: ${colors.primary};
  font-size: ${typography.fontSizes.sm};
  text-align: center;
  margin: ${spacing.md} 0 ${spacing.sm} 0;
`;