
import styled from "styled-components";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: #FFEBD3;
`;

export const RatingSection = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background-color: #fff;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
`;

export const RatingStars = styled.div`
  color: #ffb400;
  font-size: 1.2rem;
  margin-top: 0.5rem;
`;
