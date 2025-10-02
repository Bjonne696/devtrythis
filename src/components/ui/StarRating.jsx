import { RatingStars } from "../../styles/cabins/cabinStyles";

export default function StarRating({ score }) {
  if (score === 0) return null;

  const fullStars = Math.floor(score);
  const halfStar = score % 1 >= 0.25 && score % 1 < 0.75;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <RatingStars>
      {'★'.repeat(fullStars)}
      {halfStar && '⯪'}
      {'☆'.repeat(emptyStars)}
      <span style={{ marginLeft: 8, color: '#444', fontSize: '1rem' }}>
        {score.toFixed(1)} av 5
      </span>
    </RatingStars>
  );
}