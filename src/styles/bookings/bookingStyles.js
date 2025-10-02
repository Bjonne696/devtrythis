
import styled from "styled-components";

// Booking request components
export const RequestBox = styled.div`
  border: 1px solid #ccc;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #fffaf2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.2s ease;
  }

  .approve {
    background-color: #38a169;
    color: white;

    &:hover {
      background-color: #2f855a;
    }
  }

  .reject {
    background-color: #e53e3e;
    color: white;

    &:hover {
      background-color: #c53030;
    }
  }
`;

export const RequestInfo = styled.p`
  margin: 0 0 0.5rem 0;
  color: #4a2f1b;
  line-height: 1.5;

  strong {
    color: #4b3832;
  }
`;

export const RequestMessage = styled.p`
  margin: 0.5rem 0;
  padding: 0.5rem;
  background-color: rgba(117, 133, 146, 0.1);
  border-radius: 0.25rem;
  font-style: italic;
  color: #666;
`;

export const LoadingText = styled.p`
  text-align: center;
  color: #4b3832;
  font-size: 1rem;
  margin: 2rem 0;
`;

export const NoRequestsText = styled.p`
  text-align: center;
  color: #666;
  font-size: 1rem;
  margin: 2rem 0;
  padding: 1rem;
  background-color: #f9f6f0;
  border-radius: 0.5rem;
`;
