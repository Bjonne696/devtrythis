
import styled, { css } from 'styled-components';

// Colors
export const colors = {
  primary: '#4b3832',
  primaryHover: '#5a4139',
  secondary: '#758592',
  background: '#FFEBD3',
  white: '#ffffff',
  text: '#4b3832',
  textLight: '#666',
  textMuted: '#999',
  border: '#ccc',
  borderDark: '#4b3832',
  error: '#d32f2f',
  errorBackground: '#fee',
  errorBorder: '#fcc',
  success: '#3c763d',
  successBackground: '#d4edda',
  warning: '#744210',
  warningBackground: '#fff5f5',
  warningBorder: '#fed7d7',
  accent: '#2c7a7b',
  orange: '#ffa500'
};

// Typography
export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  fontFamilyHeading: "'Playfair Display', serif",
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem'
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  }
};

// Spacing
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem'
};

// Border radius
export const borderRadius = {
  sm: '0.25rem',
  base: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px'
};

// Breakpoints
export const breakpoints = {
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1200px',
  '2xl': '1400px'
};

// Media queries
export const media = {
  sm: `@media (max-width: ${breakpoints.sm})`,
  md: `@media (max-width: ${breakpoints.md})`,
  lg: `@media (max-width: ${breakpoints.lg})`,
  xl: `@media (max-width: ${breakpoints.xl})`,
  minSm: `@media (min-width: ${breakpoints.sm})`,
  minMd: `@media (min-width: ${breakpoints.md})`,
  minLg: `@media (min-width: ${breakpoints.lg})`,
  minXl: `@media (min-width: ${breakpoints.xl})`
};

// Common button styles
export const ButtonBase = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${borderRadius.base};
  font-size: ${typography.fontSizes.base};
  font-weight: ${typography.fontWeights.medium};
  font-family: ${typography.fontFamily};
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Button variants
export const buttonVariants = {
  primary: css`
    background-color: ${colors.primary};
    color: ${colors.white};
    
    &:hover:not(:disabled) {
      background-color: ${colors.primaryHover};
    }
  `,
  secondary: css`
    background-color: #f8f9fa;
    color: #495057;
    border: 1px solid #dee2e6;
    
    &:hover:not(:disabled) {
      background-color: #e9ecef;
    }
  `,
  danger: css`
    background-color: #dc3545;
    color: ${colors.white};
    
    &:hover:not(:disabled) {
      background-color: #c82333;
    }
  `,
  outline: css`
    background-color: transparent;
    color: ${colors.primary};
    border: 2px solid ${colors.primary};
    
    &:hover:not(:disabled) {
      background-color: ${colors.primary};
      color: ${colors.white};
    }
  `
};

export const Button = styled(ButtonBase)`
  ${props => props.$variant && buttonVariants[props.$variant]}
`;

// Common form elements
export const FormFieldBase = styled.div`
  margin-bottom: ${spacing.lg};
`;

export const LabelBase = styled.label`
  display: block;
  margin-bottom: ${spacing.sm};
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.text};
  font-size: ${typography.fontSizes.base};
`;

export const InputBase = styled.input`
  width: 100%;
  padding: ${spacing.md};
  font-size: ${typography.fontSizes.base};
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.base};
  font-family: ${typography.fontFamily};
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
  
  &::placeholder {
    color: ${colors.textMuted};
  }
`;

export const TextAreaBase = styled.textarea`
  width: 100%;
  padding: ${spacing.md};
  font-size: ${typography.fontSizes.base};
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.base};
  font-family: ${typography.fontFamily};
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
  
  &::placeholder {
    color: ${colors.textMuted};
  }
`;

// Common card styles
export const CardBase = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.xl};
  box-shadow: 0 4px 20px rgba(75, 56, 50, 0.08);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

// Common grid layouts
export const GridBase = styled.div`
  display: grid;
  gap: ${spacing.xl};
  
  ${media.md} {
    gap: ${spacing.lg};
  }
  
  ${media.sm} {
    gap: ${spacing.md};
  }
`;

export const ResponsiveGrid = styled(GridBase)`
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  
  ${media.minXl} {
    grid-template-columns: repeat(4, 1fr);
  }
  
  ${media.md} {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

// Common error/success messages
export const MessageBase = styled.div`
  padding: 0.75rem;
  border-radius: ${borderRadius.base};
  margin: ${spacing.md} 0;
  border-left: 4px solid;
`;

export const ErrorMessage = styled(MessageBase)`
  background-color: ${colors.errorBackground};
  color: ${colors.error};
  border-left-color: ${colors.error};
`;

export const SuccessMessage = styled(MessageBase)`
  background-color: ${colors.successBackground};
  color: ${colors.success};
  border-left-color: ${colors.success};
`;

// Common modal styles
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${spacing.md};
`;

export const ModalContent = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.xl};
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

// Common search components
export const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: ${spacing.xl} 0;
  padding: 0 ${spacing.xl};
`;

export const SearchInput = styled(InputBase)`
  max-width: 600px;
  padding: ${spacing.md};
  font-size: ${typography.fontSizes.base};
  border: 2px solid ${colors.primary};
  border-radius: ${borderRadius.full};
  background-color: ${colors.white};

  &:focus {
    outline: none;
    border-color: ${colors.secondary};
  }

  &::placeholder {
    color: ${colors.textMuted};
  }
`;

// Common page layouts
export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
  padding: 0;
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 0 ${spacing.xl} ${spacing['2xl']} ${spacing.xl};
  background-color: ${colors.background};
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  
  ${media.md} {
    padding: 0 ${spacing.md} ${spacing.xl} ${spacing.md};
  }
`;

export const CenteredMainContent = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${spacing.xl};
`;

// Additional utility components
export const Container = styled.div`
  max-width: ${breakpoints['2xl']};
  margin: 0 auto;
  padding: 0 ${spacing.xl};
  
  ${media.md} {
    padding: 0 ${spacing.md};
  }
`;

export const Section = styled.section`
  margin: ${spacing['2xl']} 0;
  
  ${media.md} {
    margin: ${spacing.xl} 0;
  }
`;

export const Heading1 = styled.h1`
  font-family: ${typography.fontFamilyHeading};
  font-size: ${typography.fontSizes['3xl']};
  font-weight: ${typography.fontWeights.bold};
  color: ${colors.text};
  margin-bottom: ${spacing.xl};
  
  ${media.md} {
    font-size: ${typography.fontSizes['2xl']};
  }
`;

export const Heading2 = styled.h2`
  font-family: ${typography.fontFamilyHeading};
  font-size: ${typography.fontSizes['2xl']};
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.text};
  margin-bottom: ${spacing.lg};
  
  ${media.md} {
    font-size: ${typography.fontSizes.xl};
  }
`;

export const Heading3 = styled.h3`
  font-family: ${typography.fontFamilyHeading};
  font-size: ${typography.fontSizes.xl};
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.text};
  margin-bottom: ${spacing.md};
`;

export const Text = styled.p`
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSizes.base};
  line-height: ${typography.lineHeights.normal};
  color: ${colors.text};
  margin-bottom: ${spacing.md};
`;

export const SmallText = styled.p`
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSizes.sm};
  line-height: ${typography.lineHeights.normal};
  color: ${colors.textLight};
  margin-bottom: ${spacing.sm};
`;

// Loading and empty states
export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${spacing['2xl']};
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid ${colors.border};
    border-top: 4px solid ${colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
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
