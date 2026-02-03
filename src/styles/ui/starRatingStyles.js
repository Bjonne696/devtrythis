import styled from "styled-components";

export const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 0.5rem;
`;

export const Star = styled.span`
  font-size: 1rem;
  color: ${props => props.$filled ? '#f5a623' : '#d4d4d4'};
  line-height: 1;
`;

export const HalfStarWrapper = styled.span`
  position: relative;
  display: inline-block;
  font-size: 1rem;
  line-height: 1;
`;

export const HalfStarBack = styled.span`
  color: #d4d4d4;
`;

export const HalfStarFront = styled.span`
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  overflow: hidden;
  color: #f5a623;
`;

export const RatingText = styled.span`
  margin-left: 8px;
  color: #444;
  font-size: 0.9rem;
`;
