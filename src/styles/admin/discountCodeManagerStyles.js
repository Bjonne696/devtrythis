import styled from 'styled-components';

export const Wrapper = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
  color: #4b3832;
  margin: 0 0 1.5rem 0;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  &.align-end {
    align-self: flex-end;
  }
`;

export const Label = styled.label`
  color: #4b3832;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

export const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

export const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

export const Button = styled.button`
  background: ${props => props.$variant === 'delete' ? '#dc3545' : '#667eea'};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$variant === 'delete' ? '#c82333' : '#5568d3'};
  }
  
  &.small {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
  
  &.with-margin {
    margin-right: 0.5rem;
  }
`;

export const CodesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
`;

export const Th = styled.th`
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4b3832;
  border-bottom: 2px solid #dee2e6;
`;

export const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${props => props.$active ? '#d4edda' : '#f8d7da'};
  color: ${props => props.$active ? '#155724' : '#721c24'};
`;

export const SuccessMessage = styled.div`
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

export const EmptyMessage = styled.p`
  text-align: center;
  color: #6c757d;
  margin-top: 2rem;
`;
