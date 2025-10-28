
import styled from 'styled-components';
import { 
  PageWrapper,
  MainContent,
  ButtonBase,
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

export const SubmitButton = styled(ButtonBase)`
  background-color: ${colors.primary};
  color: ${colors.white};
  width: 100%;
  margin-top: ${spacing.lg};
  
  &:hover:not(:disabled) {
    background-color: ${colors.primaryHover};
  }
`;

export const IntroSection = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  color: #666;
`;

export const SuccessAlert = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.lg};
  border: 1px solid #c3e6cb;
`;

export const ContactMethodsSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;

  h3 {
    color: #4b3832;
    margin-bottom: 1rem;
  }
`;

export const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

export const ContactEmailLink = styled.a`
  color: #4b3832;
`;
