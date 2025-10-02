
import styled from 'styled-components';
import { 
  PageWrapper,
  MainContent,
  BaseButton,
  FormField,
  Input,
  TextArea,
  colors,
  spacing,
  typography,
  media,
  borderRadius
} from '../common/index.js';

export const KontaktPageWrapper = styled(PageWrapper)``;

export const KontaktMainContent = styled(MainContent)``;

export const KontaktContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${spacing.xl};
  
  ${media.md} {
    padding: ${spacing.lg} ${spacing.md};
  }
`;

export const KontaktHeader = styled.div`
  text-align: center;
  margin-bottom: ${spacing['2xl']};
  
  h1 {
    font-family: ${typography.fontFamilyHeading};
    font-size: ${typography.fontSizes['3xl']};
    color: ${colors.primary};
    margin-bottom: ${spacing.md};
  }
  
  p {
    font-size: ${typography.fontSizes.lg};
    color: ${colors.text};
    line-height: ${typography.lineHeights.normal};
  }
`;

export const KontaktContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing['2xl']};
  
  ${media.lg} {
    grid-template-columns: 1fr;
    gap: ${spacing.xl};
  }
`;

export const ContactForm = styled.form`
  background-color: ${colors.white};
  padding: ${spacing.xl};
  border-radius: ${borderRadius.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const ContactInfo = styled.div`
  background-color: ${colors.white};
  padding: ${spacing.xl};
  border-radius: ${borderRadius.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const SectionTitle = styled.h2`
  font-family: ${typography.fontFamilyHeading};
  font-size: ${typography.fontSizes.xl};
  color: ${colors.text};
  margin-bottom: ${spacing.lg};
`;

export const ContactItem = styled.div`
  margin-bottom: ${spacing.lg};
  
  h3 {
    font-family: ${typography.fontFamilyHeading};
    font-size: ${typography.fontSizes.lg};
    color: ${colors.primary};
    margin-bottom: ${spacing.sm};
  }
  
  p {
    color: ${colors.text};
    margin: 0;
    line-height: ${typography.lineHeights.normal};
  }
`;

export const SubmitButton = styled(BaseButton)`
  background-color: ${colors.primary};
  color: ${colors.white};
  width: 100%;
  margin-top: ${spacing.lg};
  
  &:hover:not(:disabled) {
    background-color: ${colors.primaryHover};
  }
`;
