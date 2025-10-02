
import styled from "styled-components";

export const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #fffaf2;
  border: 1px solid #ccc;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
`;

export const AvatarPreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #4b3832;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.875rem;
  text-align: center;
`;

export const UploadButton = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  background-color: #758592;
  color: white;
  border: 2px solid #4b3832;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #5d7171;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const ProgressContainer = styled.div`
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 4px;
  height: 8px;
  margin: 0.5rem 0;
`;

export const ProgressBar = styled.div`
  height: 100%;
  background-color: #4b3832;
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${props => props.$progress}%;
`;

export const ErrorMessage = styled.p`
  color: #dc3545;
  font-size: 0.875rem;
  text-align: center;
  margin: 0;
`;
