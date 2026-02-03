import styled from "styled-components";
import { 
  PageWrapper as BasePageWrapper,
  MainContent as BaseMainContent,
  SearchContainer as BaseSearchContainer,
  SearchInput as BaseSearchInput,
  colors,
  spacing,
  borderRadius,
  typography,
  media,
  breakpoints
} from '../common/index.js';

export const PageWrapper = styled(BasePageWrapper)``;

export const MainContent = styled(BaseMainContent)`
  > h1 {
    text-align: center !important;
    margin-bottom: ${spacing.xl};
    width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
`;

export const SearchContainer = styled(BaseSearchContainer)``;

export const SearchInput = styled(BaseSearchInput)``;

export const SearchResultsSection = styled.div`
  margin-top: 2rem;
`;

export const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #4b3832;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
`;


export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

export const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid #4b3832;
  background-color: ${(props) => (props.$active ? "#4b3832" : "white")};
  color: ${(props) => (props.$active ? "white" : "#4b3832")};
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #4b3832;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
`;

export const NoResults = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin: 2rem 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;