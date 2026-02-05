import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const NotFoundWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f0e8;
`;

export const NotFoundContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

export const NotFoundIcon = styled.div`
  font-size: 6rem;
  margin-bottom: 1rem;
`;

export const NotFoundTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  color: #5a4a3a;
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

export const NotFoundSubtitle = styled.h2`
  font-size: 1.5rem;
  color: #7a6a5a;
  margin: 0 0 1rem 0;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const NotFoundDescription = styled.p`
  font-size: 1.1rem;
  color: #8a7a6a;
  max-width: 500px;
  margin: 0 0 2rem 0;
  line-height: 1.6;
`;

export const NotFoundActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const NotFoundLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: #5a4a3a;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #4a3a2a;
    transform: translateY(-2px);
  }
`;

export const NotFoundSecondaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: transparent;
  color: #5a4a3a;
  text-decoration: none;
  border: 2px solid #5a4a3a;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: #5a4a3a;
    color: white;
    transform: translateY(-2px);
  }
`;

export const SuggestedLinks = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #d0c4b4;
`;

export const SuggestedTitle = styled.h3`
  font-size: 1.1rem;
  color: #7a6a5a;
  margin: 0 0 1rem 0;
  font-weight: 500;
`;

export const SuggestedGrid = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const SuggestedLink = styled(Link)`
  padding: 0.6rem 1rem;
  background-color: #e8e0d4;
  color: #5a4a3a;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #d8d0c4;
  }
`;
