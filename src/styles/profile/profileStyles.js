import styled from "styled-components";
import { 
  colors,
  spacing,
  typography,
  borderRadius,
  media,
  ButtonBase
} from '../common/index.js';

export const ProfileWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
  background-color: #FFEBD3;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 1200px) {
    max-width: 100%;
    padding: 2.5rem 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
  }
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 1024px) {
    padding: 1.5rem;
    flex-direction: column;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

export const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;

  @media (max-width: 768px) {
    align-items: stretch;
  }
`;

export const MiddleSection = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 1024px) {
    gap: 1.5rem;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

export const ProfileTitle = styled.h1`
  color: #4a2f1b;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

export const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #4b3832;
`;

export const PlaceholderImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.9rem;
  border: 3px solid #4b3832;

  &::before {
    content: "👤";
    font-size: 3rem;
  }
`;

export const ProfileRow = styled.p`
  margin: 0.5rem 0;
  color: #4b3832;
  font-size: 1rem;

  strong {
    font-weight: 600;
    color: #4b3832;
  }
`;

export const Box = styled.div`
  flex: 1;
  min-width: 250px;
  padding: 1.5rem;
  background-color: #f9f6f0;
  border: 1px solid #ccc;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #4b3832;
    font-size: 1.2rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: stretch;
    flex-direction: column;
  }
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;

  ${props => props.$variant === 'primary' && `
    background-color: #4b3832;
    color: white;
    &:hover { background-color: #5a4139; }
  `}

  ${props => props.$variant === 'secondary' && `
    background-color: #6c757d;
    color: white;
    &:hover { background-color: #545b62; }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledCard = styled.div`
  background-color: #fffaf2;
  border: 1px solid #ccc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  h4 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #4b3832;
    font-size: 1.1rem;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4b3832;
  }
`;

export const ActionButton = styled.button`
  background-color: #4b3832;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #5a4139;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SaveButton = styled.button`
  background-color: #4b3832;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #5a4139;
  }
`;

export const CabinImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 0.5rem;
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

export const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border-left: 4px solid #c33;
  margin: 1rem 0;
`;