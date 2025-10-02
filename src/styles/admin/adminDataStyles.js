
import styled from "styled-components";

export const AdminWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #FFEBD3;
  min-height: 100vh;
`;

export const AdminTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #4b3832;
  font-size: 2.5rem;
`;

export const SubHeading = styled.h2`
  color: #4b3832;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
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
`;

export const TableSection = styled.div`
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  h2 {
    color: #4b3832;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }
  
  th {
    background-color: #f5f5f5;
    font-weight: 600;
    color: #4b3832;
  }
  
  tr:hover {
    background-color: #f9f9f9;
  }
`;

export const Th = styled.th`
  background-color: #f5f5f5;
  font-weight: 600;
  color: #4b3832;
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
`;

export const Td = styled.td`
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  color: #4b3832;
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
`;

export const LoadingText = styled.p`
  text-align: center;
  color: #4b3832;
  font-size: 1.2rem;
  margin: 2rem 0;
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
`;
