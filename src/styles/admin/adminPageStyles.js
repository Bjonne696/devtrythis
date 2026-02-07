
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

  @media (max-width: 768px) {
    padding: ${spacing.lg};
  }

  @media (max-width: 480px) {
    padding: ${spacing.md};
  }
`;

export const Heading = styled.h1`
  color: ${colors.text};
  font-size: ${typography.fontSizes['2xl']};
  font-family: ${typography.fontFamilyHeading};
  margin-bottom: ${spacing['2xl']};
  text-align: center;

  @media (max-width: 768px) {
    font-size: ${typography.fontSizes.xl};
    margin-bottom: ${spacing.lg};
  }

  @media (max-width: 480px) {
    font-size: ${typography.fontSizes.lg};
    margin-bottom: ${spacing.md};
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${spacing['2xl']};
  background-color: ${colors.white};
  border-radius: ${borderRadius.base};
  overflow: hidden;

  @media (max-width: 768px) {
    margin-top: ${spacing.lg};
  }
`;

export const Th = styled.th`
  border: 1px solid ${colors.border};
  padding: ${spacing.md};
  background-color: #f5f5f5;
  text-align: left;
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.text};

  @media (max-width: 768px) {
    padding: ${spacing.sm};
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    padding: ${spacing.xs} ${spacing.sm};
    font-size: 0.8rem;
  }
`;

export const Td = styled.td`
  border: 1px solid ${colors.border};
  padding: ${spacing.md};

  @media (max-width: 768px) {
    padding: ${spacing.sm};
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    padding: ${spacing.xs} ${spacing.sm};
    font-size: 0.8rem;
  }
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

  @media (max-width: 480px) {
    padding: ${spacing.xs} ${spacing.sm};
    font-size: 0.8rem;
    width: 100%;
  }
`;

export const AdminWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const SubHeading = styled.h2`
  color: ${colors.text};
  font-size: ${typography.fontSizes.xl};
  font-family: ${typography.fontFamilyHeading};
  margin-bottom: ${spacing.lg};

  @media (max-width: 768px) {
    font-size: ${typography.fontSizes.lg};
    margin-bottom: ${spacing.md};
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;
