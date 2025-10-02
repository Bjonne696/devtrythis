
import styled from 'styled-components';
import { 
  colors,
  spacing,
  borderRadius,
  typography
} from '../common/index.js';

export const HelpTextWrapper = styled.div`
  background-color: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: ${borderRadius.base};
  padding: ${spacing.lg};
  margin-bottom: ${spacing.xl};
  
  strong {
    color: ${colors.primary};
    font-weight: ${typography.fontWeights.semibold};
  }
  
  ul {
    margin: ${spacing.sm} 0 0 0;
    padding-left: ${spacing.lg};
    
    li {
      margin-bottom: ${spacing.xs};
      font-size: ${typography.fontSizes.sm};
      color: ${colors.textLight};
      line-height: ${typography.lineHeights.normal};
    }
  }
  
  p {
    margin: 0;
    font-size: ${typography.fontSizes.sm};
    color: ${colors.textLight};
    line-height: ${typography.lineHeights.normal};
  }
`;
