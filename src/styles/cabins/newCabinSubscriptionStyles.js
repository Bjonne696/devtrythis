import styled from 'styled-components';

export const SubscriptionSection = styled.section`
  background: linear-gradient(135deg, #f9f6f0 0%, #faf7f2 100%);
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 2px 8px rgba(75, 56, 50, 0.08);
`;

export const SectionTitle = styled.h3`
  color: #4b3832;
  font-family: 'Playfair Display', serif;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

export const PlanSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const PlanCard = styled.div`
  border: 2px solid ${props => props.$selected ? '#4b3832' : '#e0e0e0'};
  background: ${props => props.$selected ? '#f9f6f0' : 'white'};
  padding: 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f9f6f0;
  }
`;

export const PlanName = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #4b3832;
  font-weight: 600;
`;

export const PlanPrice = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #4b3832;
  margin: 0.5rem 0;
`;

export const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;

  li {
    padding: 0.3rem 0;
    color: #4b3832;

    &:before {
      content: '✓ ';
      font-weight: bold;
      color: #28a745;
      margin-right: 0.5rem;
    }
  }
`;

export const DiscountSection = styled.div`
  background: #f9f6f0;
  border: 1px solid #e0e0e0;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #4b3832;
  }
`;

export const DiscountInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  text-transform: uppercase;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

  &:focus {
    outline: none;
    border-color: #4b3832;
  }
`;

export const ValidateButton = styled.button`
  background: #4b3832;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #5a4139;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const DiscountSuccess = styled.div`
  background: #d4edda;
  border: 1px solid #28a745;
  color: #155724;
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 0.5rem;
  font-weight: 500;
`;

export const DiscountError = styled.div`
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 4px solid #c33;
  margin-top: 0.5rem;
`;

export const InfoBox = styled.div`
  background: #e8f4f8;
  border: 1px solid #bee5eb;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #0c5460;
`;

export const SubmitMessage = styled.div`
  padding: 0.75rem;
  border-radius: 6px;
  margin: 1rem 0;

  ${props => {
    if (props.$type === 'error') {
      return `
        background: #fee;
        color: #c33;
        border-left: 4px solid #c33;
      `;
    }
    if (props.$type === 'success') {
      return `
        background: #d4edda;
        color: #155724;
        border-left: 4px solid #28a745;
      `;
    }
    return '';
  }}
`;
