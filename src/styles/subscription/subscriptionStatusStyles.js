import styled from 'styled-components';

export const StatusWrapper = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const StatusTitle = styled.h3`
  margin: 0;
  color: #4b3832;
`;

export const StatusBadge = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.$status) {
      case 'active':
        return 'background: #d4edda; color: #155724;';
      case 'pending':
        return 'background: #fff3cd; color: #856404;';
      case 'past_due':
        return 'background: #f8d7da; color: #721c24;';
      case 'canceled':
        return 'background: #e2e3e5; color: #383d41;';
      default:
        return 'background: #e2e3e5; color: #383d41;';
    }
  }}
`;

export const StatusInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const InfoItem = styled.div`
  p {
    margin: 0 0 0.3rem 0;
    font-size: 0.9rem;
    color: #6c757d;
  }
  
  strong {
    font-size: 1.1rem;
    color: #4b3832;
  }
`;

export const ActionButton = styled.button`
  background: ${props => props.$variant === 'danger' ? '#dc3545' : '#667eea'};
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.$variant === 'danger' ? '#c82333' : '#5568d3'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const NoSubscription = styled.div`
  text-align: center;
  padding: 2rem;
  
  p {
    margin: 0 0 1rem 0;
    color: #6c757d;
  }
`;

export const WarningText = styled.p`
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 6px;
  padding: 0.8rem;
  margin: 1rem 0;
  color: #856404;
  font-size: 0.9rem;
`;
