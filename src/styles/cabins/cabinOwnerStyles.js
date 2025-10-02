
import styled from "styled-components";

export const OwnerSection = styled.div`
  background-color: #f8f9fa;
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 2rem 0;
`;

export const OwnerTitle = styled.h3`
  color: #4b3832;
  margin-bottom: 1rem;
  font-size: 1.3rem;
`;

export const OwnerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const OwnerAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4b3832;
`;

export const OwnerAvatarPlaceholder = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.5rem;
`;

export const OwnerDetails = styled.div`
  flex: 1;
`;

export const OwnerName = styled.h4`
  color: #4b3832;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

export const OwnerContact = styled.p`
  color: #666;
  margin: 0;
  font-size: 0.9rem;
`;

export const ContactButton = styled.button`
  background-color: #4b3832;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background-color: #5a4139;
  }
`;

export const LoadingText = styled.p`
  color: #666;
  font-style: italic;
`;
