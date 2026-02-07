import styled from 'styled-components';

export const Wrapper = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.25rem;
    margin: 1.5rem 0;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 6px;
  }
`;

export const Title = styled.h2`
  color: #4b3832;
  margin: 0 0 1.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1.15rem;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  &.align-end {
    align-self: flex-end;
  }

  @media (max-width: 768px) {
    &.align-end {
      align-self: stretch;
    }
  }
`;

export const Label = styled.label`
  color: #4b3832;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
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

  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.95rem;
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

  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.95rem;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.75rem 1.25rem;

    &.small {
      width: auto;
      padding: 0.45rem 0.8rem;
      font-size: 0.85rem;
    }

    &.with-margin {
      margin-right: 0.4rem;
      margin-bottom: 0.25rem;
    }
  }

  @media (max-width: 480px) {
    &.small {
      width: 100%;
      margin-right: 0;
      margin-bottom: 0.3rem;
    }

    &.with-margin {
      margin-right: 0;
    }
  }
`;

export const CodesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;

  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }

  @media (max-width: 480px) {
    margin-top: 1rem;

    thead {
      display: none;
    }

    tbody tr {
      display: flex;
      flex-direction: column;
      padding: 0.75rem 0;
      border-bottom: 2px solid #dee2e6;

      &:last-child {
        border-bottom: none;
      }
    }
  }
`;

export const Th = styled.th`
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4b3832;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

export const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #495057;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: none;

    &::before {
      content: attr(data-label);
      font-weight: 600;
      color: #4b3832;
      margin-right: 0.5rem;
      flex-shrink: 0;
    }
  }
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    gap: 0.3rem;
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${props => props.$active ? '#d4edda' : '#f8d7da'};
  color: ${props => props.$active ? '#155724' : '#721c24'};

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.25rem 0.6rem;
  }
`;

export const SuccessMessage = styled.div`
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
`;

export const EmptyMessage = styled.p`
  text-align: center;
  color: #6c757d;
  margin-top: 2rem;

  @media (max-width: 480px) {
    margin-top: 1rem;
    font-size: 0.9rem;
  }
`;
