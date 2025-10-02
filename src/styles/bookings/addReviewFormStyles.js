
import styled from "styled-components";

export const ReviewFormWrapper = styled.div`
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const ReviewFormTitle = styled.h3`
  color: #4b3832;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

export const ReviewForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: 500;
  color: #4b3832;
  font-size: 1rem;
`;

export const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const StarContainer = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${props => props.$filled ? '#ffd700' : '#e0e0e0'};
  transition: color 0.2s ease;
  
  &:hover {
    color: #ffd700;
  }
`;

export const RatingText = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

export const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #4b3832;
  }
  
  &::placeholder {
    color: #999;
  }
`;

export const SubmitButton = styled.button`
  background-color: #4b3832;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  align-self: flex-start;
  
  &:hover {
    background-color: #5a4139;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border-left: 4px solid #c33;
  margin: 1rem 0;
`;

export const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border-left: 4px solid #155724;
  margin: 1rem 0;
`;

export const LoginPrompt = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  
  p {
    margin-bottom: 1rem;
  }
`;

export const LoginLink = styled.button`
  background-color: #4b3832;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    background-color: #5a4139;
  }
`;
