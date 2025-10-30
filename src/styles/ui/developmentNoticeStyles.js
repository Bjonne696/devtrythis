import styled from 'styled-components';
import { colors, spacing, borderRadius, typography, media } from '../common/index.js';

export const NoticeContainer = styled.div`
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 2px solid #ffc107;
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  margin: ${spacing.xl} auto;
  max-width: 900px;
  position: relative;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
  display: flex;
  align-items: flex-start;
  gap: ${spacing.md};

  ${media.md} {
    padding: ${spacing.md};
    margin: ${spacing.lg} auto;
  }
`;

export const NoticeIcon = styled.div`
  background-color: #ff9800;
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${typography.fontWeights.bold};
  font-size: ${typography.fontSizes.xl};
  flex-shrink: 0;

  ${media.md} {
    width: 32px;
    height: 32px;
    font-size: ${typography.fontSizes.lg};
  }
`;

export const NoticeContent = styled.div`
  flex: 1;
  line-height: ${typography.lineHeights.relaxed};
  color: ${colors.text};

  h3 {
    margin: 0 0 ${spacing.sm} 0;
    font-size: ${typography.fontSizes.lg};
    font-weight: ${typography.fontWeights.semibold};
    color: #744210;

    ${media.md} {
      font-size: ${typography.fontSizes.base};
    }
  }

  p {
    margin: ${spacing.xs} 0;
    font-size: ${typography.fontSizes.base};
    color: #856404;

    ${media.md} {
      font-size: ${typography.fontSizes.sm};
    }
  }

  ul {
    margin: ${spacing.sm} 0;
    padding-left: ${spacing.lg};

    ${media.md} {
      padding-left: ${spacing.md};
    }
  }

  li {
    margin: ${spacing.xs} 0;
    font-size: ${typography.fontSizes.sm};
    color: #856404;

    ${media.md} {
      font-size: ${typography.fontSizes.xs};
    }
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: ${spacing.md};
  right: ${spacing.md};
  background: transparent;
  border: none;
  font-size: ${typography.fontSizes.xl};
  color: #856404;
  cursor: pointer;
  padding: ${spacing.xs};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borderRadius.base};
  transition: all 0.2s ease;
  line-height: 1;

  &:hover {
    background-color: rgba(133, 100, 4, 0.1);
    color: #744210;
  }

  &:active {
    transform: scale(0.95);
  }

  ${media.md} {
    top: ${spacing.sm};
    right: ${spacing.sm};
    font-size: ${typography.fontSizes.lg};
    width: 28px;
    height: 28px;
  }
`;
