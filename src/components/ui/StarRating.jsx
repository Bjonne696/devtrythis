import React from 'react';
import styled from 'styled-components';

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 0.5rem;
`;

const Star = styled.span`
  font-size: 1rem;
  color: ${props => props.$filled ? '#f5a623' : '#d4d4d4'};
  line-height: 1;
`;

const HalfStarWrapper = styled.span`
  position: relative;
  display: inline-block;
  font-size: 1rem;
  line-height: 1;
`;

const HalfStarBack = styled.span`
  color: #d4d4d4;
`;

const HalfStarFront = styled.span`
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  overflow: hidden;
  color: #f5a623;
`;

const RatingText = styled.span`
  margin-left: 8px;
  color: #444;
  font-size: 0.9rem;
`;

export default function StarRating({ score }) {
  if (score === 0) return null;

  const fullStars = Math.floor(score);
  const hasHalfStar = score % 1 >= 0.25 && score % 1 < 0.75;
  const hasFullAfterDecimal = score % 1 >= 0.75;
  const adjustedFullStars = hasFullAfterDecimal ? fullStars + 1 : fullStars;
  const emptyStars = 5 - adjustedFullStars - (hasHalfStar ? 1 : 0);

  return (
    <RatingContainer>
      {[...Array(adjustedFullStars)].map((_, i) => (
        <Star key={`full-${i}`} $filled>★</Star>
      ))}
      {hasHalfStar && (
        <HalfStarWrapper>
          <HalfStarBack>★</HalfStarBack>
          <HalfStarFront>★</HalfStarFront>
        </HalfStarWrapper>
      )}
      {[...Array(Math.max(0, emptyStars))].map((_, i) => (
        <Star key={`empty-${i}`}>★</Star>
      ))}
      <RatingText>
        {score.toFixed(1)} av 5
      </RatingText>
    </RatingContainer>
  );
}
