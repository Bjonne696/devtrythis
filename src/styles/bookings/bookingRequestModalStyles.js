
import styled from 'styled-components';
import { 
  ModalOverlay as BaseModalOverlay,
  ModalContent as BaseModalContent,
  FormFieldBase,
  LabelBase,
  InputBase,
  TextAreaBase,
  Button as BaseButton,
  ErrorMessage as BaseErrorMessage,
  SuccessMessage as BaseSuccessMessage,
  colors,
  spacing,
  borderRadius,
  typography,
  media
} from '../common/index.js';

export const ModalOverlay = styled(BaseModalOverlay)``;

export const ModalContent = styled(BaseModalContent)`
  max-width: 600px;
  
  ${media.md} {
    margin: ${spacing.md};
    max-height: 95vh;
  }
`;

export const ModalHeader = styled.div`
  margin-bottom: ${spacing.xl};
  
  h2 {
    font-family: ${typography.fontFamilyHeading};
    font-size: ${typography.fontSizes.xl};
    color: ${colors.text};
    margin: 0;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: ${spacing.md};
  right: ${spacing.md};
  background: none;
  border: none;
  font-size: ${typography.fontSizes.xl};
  color: ${colors.textLight};
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borderRadius.base};
  
  &:hover {
    background-color: #f5f5f5;
    color: ${colors.text};
  }
`;

export const FormField = styled(FormFieldBase)``;

export const Label = styled(LabelBase)``;

export const Input = styled(InputBase)``;

export const TextArea = styled(TextAreaBase)``;

export const DateInputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.md};
  
  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

export const PriceCalculation = styled.div`
  background-color: #f8f9fa;
  padding: ${spacing.lg};
  border-radius: ${borderRadius.base};
  margin: ${spacing.lg} 0;
  
  h3 {
    font-size: ${typography.fontSizes.lg};
    margin: 0 0 ${spacing.md} 0;
    color: ${colors.text};
  }
  
  .price-line {
    display: flex;
    justify-content: space-between;
    margin-bottom: ${spacing.sm};
    
    &.total {
      border-top: 1px solid ${colors.border};
      padding-top: ${spacing.sm};
      font-weight: ${typography.fontWeights.semibold};
      font-size: ${typography.fontSizes.lg};
    }
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.md};
  justify-content: flex-end;
  margin-top: ${spacing.xl};
  
  ${media.sm} {
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
    background-color: #f8f9fa;
    color: #495057;
    border: 1px solid #dee2e6;
    &:hover:not(:disabled) { background-color: #e9ecef; }
  `}
`;

export const ErrorMessage = styled(BaseErrorMessage)``;

export const SuccessMessage = styled(BaseSuccessMessage)``;
