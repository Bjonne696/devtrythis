
import styled from "styled-components";

// Review form components
export const FormWrapper = styled.div`
  border: 1px solid #ccc;
  padding: 1.5rem;
  border-radius: 0.75rem;
  background: #fff;
  margin-top: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const FormLabel = styled.label`
  display: block;
  color: #4a2f1b;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

export const StarRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;

  span {
    cursor: pointer;
    color: #ddd;
    transition: color 0.2s ease;
    user-select: none;

    &:hover {
      color: #f5a623;
    }
  }

  .active {
    color: #f5a623;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #758592;
  }

  &::placeholder {
    color: #999;
  }
`;

export const SubmitButton = styled.button`
  background-color: #4B3832;
  color: white;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #3a2314;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
  padding: 0.5rem;
  background-color: rgba(211, 47, 47, 0.1);
  border: 1px solid rgba(211, 47, 47, 0.2);
  border-radius: 0.25rem;
`;

export const SuccessMessage = styled.p`
  color: #2e7d32;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
  padding: 0.5rem;
  background-color: rgba(46, 125, 50, 0.1);
  border: 1px solid rgba(46, 125, 50, 0.2);
  border-radius: 0.25rem;
`;
