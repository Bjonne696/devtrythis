
import styled from "styled-components";

export const AdminWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #FFEBD3;
  min-height: 100vh;

  @media (max-width: 1024px) {
    max-width: 100%;
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

export const AdminTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #4b3832;
  font-size: 2.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
`;

export const SubHeading = styled.h2`
  color: #4b3832;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;

  @media (max-width: 768px) {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
`;

export const StatCard = styled.div`
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;

  h3 {
    color: #4b3832;
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  p {
    color: #758592;
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
  }

  @media (max-width: 768px) {
    padding: 1.25rem;

    h3 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 0.75rem;

    h3 {
      font-size: 0.95rem;
    }

    p {
      font-size: 1.3rem;
    }
  }
`;

export const TableSection = styled.div`
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow-x: auto;

  h2 {
    color: #4b3832;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 0.75rem;

    h2 {
      font-size: 1.4rem;
      margin-bottom: 1rem;
    }
  }

  @media (max-width: 480px) {
    padding: 0.75rem;

    h2 {
      font-size: 1.2rem;
    }
  }
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 0 -0.5rem;
  padding: 0 0.5rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 500px;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }
  
  th {
    background-color: #f5f5f5;
    font-weight: 600;
    color: #4b3832;
    white-space: nowrap;
  }
  
  tr:hover {
    background-color: #f9f9f9;
  }

  @media (max-width: 768px) {
    min-width: 400px;

    th, td {
      padding: 0.75rem 0.5rem;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    min-width: 100%;
    
    thead {
      display: none;
    }

    tr {
      display: flex;
      flex-direction: column;
      padding: 0.75rem 0;
      border-bottom: 2px solid #e0e0e0;
    }

    td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.4rem 0;
      border-bottom: none;
      font-size: 0.9rem;

      &::before {
        content: attr(data-label);
        font-weight: 600;
        color: #4b3832;
        margin-right: 1rem;
        flex-shrink: 0;
      }
    }
  }
`;

export const Th = styled.th`
  background-color: #f5f5f5;
  font-weight: 600;
  color: #4b3832;
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

export const Td = styled.td`
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  color: #4b3832;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.4rem 0;
    border-bottom: none;
    font-size: 0.9rem;

    &::before {
      content: attr(data-label);
      font-weight: 600;
      color: #4b3832;
      margin-right: 1rem;
      flex-shrink: 0;
    }
  }
`;

export const MobileTableRow = styled.tr`
  @media (max-width: 480px) {
    display: flex;
    flex-direction: column;
    padding: 0.75rem 0;
    border-bottom: 2px solid #e0e0e0;
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

export const ActionButton = styled.button`
  background-color: ${props => props.$danger ? '#dc3545' : '#4b3832'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  margin-right: 0.5rem;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 0.25rem;
    padding: 0.6rem 1rem;
  }
`;

export const LoadingText = styled.p`
  text-align: center;
  color: #4b3832;
  font-size: 1.2rem;
  margin: 2rem 0;

  @media (max-width: 480px) {
    font-size: 1rem;
    margin: 1rem 0;
  }
`;

export const ErrorText = styled.p`
  color: #dc3545;
  text-align: center;
  margin: 1rem 0;
`;

export const DeleteButton = styled.button`
  background-color: #ffdddd;
  color: #a00;
  border: 1px solid #a00;
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #ffcccc;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
  }
`;
