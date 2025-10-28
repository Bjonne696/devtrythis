import styled from 'styled-components';

export const PaywallWrapper = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin: 2rem 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

export const PaywallTitle = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
  font-weight: 600;
`;

export const PaywallDescription = styled.p`
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.95;
`;

export const PlanSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1.5rem 0;
`;

export const PlanCard = styled.div`
  background: ${props => props.$selected ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${props => props.$selected ? 'white' : 'transparent'};
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const PlanName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
`;

export const PlanPrice = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin: 0.5rem 0;
`;

export const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
  
  li {
    padding: 0.3rem 0;
    &:before {
      content: "✓ ";
      font-weight: bold;
    }
  }
`;

export const ActivateButton = styled.button`
  background: white;
  color: #667eea;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  background: rgba(255, 0, 0, 0.2);
  border: 1px solid rgba(255, 0, 0, 0.4);
  color: white;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
`;

export const InfoBox = styled.div`
  background: rgba(255, 255, 255, 0.15);
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  font-size: 0.95rem;
`;

export const DiscountBox = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
`;

export const DiscountInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  color: #4b3832;
  text-transform: uppercase;
  
  &:focus {
    outline: none;
    border-color: white;
  }
`;

export const ValidateButton = styled.button`
  background: rgba(255, 255, 255, 0.3);
  color: white;
  border: 2px solid white;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: white;
    color: #667eea;
  }
`;

export const SuccessBox = styled.div`
  background: rgba(40, 167, 69, 0.3);
  border: 2px solid #28a745;
  color: white;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  font-weight: 500;
`;
