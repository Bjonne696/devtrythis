
import styled from "styled-components";

export const StarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const Star = styled.span`
  font-size: ${props => props.$size || '1rem'};
  color: ${props => props.$filled ? '#ffd700' : '#e0e0e0'};
  cursor: ${props => props.$interactive ? 'pointer' : 'default'};
  transition: color 0.2s ease;
  
  ${props => props.$interactive && `
    &:hover {
      color: #ffd700;
    }
  `}
`;

export const RatingText = styled.span`
  color: #666;
  font-size: ${props => props.$size === 'large' ? '1rem' : '0.875rem'};
  margin-left: 0.5rem;
  font-weight: 500;
`;
