
import styled from 'styled-components';

export const BannerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(75, 56, 50, 0.95);
  backdrop-filter: blur(10px);
  color: white;
  padding: 1rem;
  z-index: 1000;
  border-top: 3px solid #8b7355;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

export const BannerContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

export const BannerText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  flex: 1;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

export const PolicyLink = styled.a`
  color: #d4c4a8;
  text-decoration: underline;
  margin-left: 0.5rem;
  
  &:hover {
    color: #e6d7bb;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const AcceptButton = styled.button`
  background-color: #8b7355;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #9d8461;
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    flex: 1;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }
`;

export const CloseButton = styled.button`
  background-color: transparent;
  color: #d4c4a8;
  border: 1px solid #8b7355;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(139, 115, 85, 0.2);
    color: white;
  }
  
  @media (max-width: 768px) {
    flex: 1;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }
`;
