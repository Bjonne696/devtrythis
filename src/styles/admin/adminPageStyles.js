
import styled from "styled-components";
import { 
  colors,
  spacing,
  typography,
  borderRadius
} from '../common/index.js';

export const MainWrapper = styled.main`
  padding: ${spacing['2xl']};
  min-height: 60vh;
  background-color: ${colors.background};
`;

export const Heading = styled.h1`
  color: ${colors.text};
  font-size: ${typography.fontSizes['2xl']};
  font-family: ${typography.fontFamilyHeading};
  margin-bottom: ${spacing['2xl']};
  text-align: center;
`;

// Admin table styles
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${spacing['2xl']};
  background-color: ${colors.white};
  border-radius: ${borderRadius.base};
  overflow: hidden;
`;

export const Th = styled.th`
  border: 1px solid ${colors.border};
  padding: ${spacing.md};
  background-color: #f5f5f5;
  text-align: left;
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.text};
`;

export const Td = styled.td`
  border: 1px solid ${colors.border};
  padding: ${spacing.md};
`;

export const DeleteButton = styled.button`
  background-color: ${colors.errorBackground};
  color: ${colors.error};
  border: 1px solid ${colors.error};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.base};
  cursor: pointer;
  font-weight: ${typography.fontWeights.medium};

  &:hover {
    background-color: #ffcccc;
  }
`;

export const AdminWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

export const SubHeading = styled.h2`
  color: ${colors.text};
  font-size: ${typography.fontSizes.xl};
  font-family: ${typography.fontFamilyHeading};
  margin-bottom: ${spacing.lg};
`;
