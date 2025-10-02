
import styled from 'styled-components';
import { 
  PageWrapper,
  colors,
  spacing,
  typography,
  media,
  borderRadius
} from '../common/index.js';

export const PageContainer = styled(PageWrapper)`
  background-color: ${colors.background};
  min-height: 100vh;
`;

export const ContentSection = styled.section`
  max-width: 800px;
  margin: 0 auto;
  padding: ${spacing['2xl']};
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: ${spacing.xl};
  margin-bottom: ${spacing.xl};
  
  ${media.md} {
    padding: ${spacing.xl} ${spacing.lg};
    margin: ${spacing.lg};
  }
`;

export const Title = styled.h1`
  font-family: ${typography.fontFamilyHeading};
  font-size: ${typography.fontSizes['3xl']};
  color: ${colors.primary};
  text-align: center;
  margin-bottom: ${spacing.xl};
`;

export const Subtitle = styled.h2`
  font-family: ${typography.fontFamilyHeading};
  font-size: ${typography.fontSizes.xl};
  color: ${colors.text};
  margin: ${spacing.xl} 0 ${spacing.md} 0;
`;

export const TextBlock = styled.p`
  font-size: ${typography.fontSizes.base};
  line-height: 1.6;
  color: ${colors.text};
  margin-bottom: ${spacing.lg};
`;

export const List = styled.ul`
  margin: ${spacing.md} 0 ${spacing.lg} ${spacing.lg};
  color: ${colors.text};
`;

export const ListItem = styled.li`
  margin-bottom: ${spacing.sm};
  line-height: 1.5;
`;

export const ContactInfo = styled.div`
  background-color: ${colors.backgroundLight};
  padding: ${spacing.lg};
  border-radius: ${borderRadius.base};
  margin-top: ${spacing.xl};
  text-align: center;
  
  p {
    margin: ${spacing.sm} 0;
    color: ${colors.text};
  }
  
  strong {
    color: ${colors.primary};
  }
`;
