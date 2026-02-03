import React from 'react';
import {
  RatingContainer,
  Star,
  HalfStarWrapper,
  HalfStarBack,
  HalfStarFront,
  RatingText
} from '../../styles/ui/starRatingStyles';

export default function StarRating({ score }) {
  if (score === 0) return null;

  const decimal = score % 1;
  const fullStars = Math.floor(score);
  const hasHalfStar = decimal >= 0.25 && decimal < 0.75;
  const roundUp = decimal >= 0.75;
  const displayFullStars = roundUp ? Math.min(fullStars + 1, 5) : fullStars;
  const emptyStars = 5 - displayFullStars - (hasHalfStar ? 1 : 0);

  return (
    <RatingContainer>
      {[...Array(displayFullStars)].map((_, i) => (
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
