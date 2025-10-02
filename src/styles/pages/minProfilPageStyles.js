import styled from 'styled-components';
import { 
  PageWrapper,
  MainContent,
  Button as BaseButton,
  colors,
  spacing,
  typography,
  media,
  borderRadius
} from '../common/index.js';

export const ProfilePageWrapper = styled(PageWrapper)``;

export const ProfileMainContent = styled(MainContent)``;

export const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing.xl};
  
  ${media.md} {
    padding: ${spacing.lg} ${spacing.md};
  }
`;

export const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: ${spacing['2xl']};
  
  h1 {
    font-family: ${typography.fontFamilyHeading};
    font-size: ${typography.fontSizes['2xl']};
    color: ${colors.primary};
    margin-bottom: ${spacing.md};
  }
`;

export const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${spacing.xl};
  
  ${media.lg} {
    grid-template-columns: 1fr;
    gap: ${spacing.lg};
  }
`;

export const ProfileSidebar = styled.div`
  background-color: ${colors.white};
  padding: ${spacing.xl};
  border-radius: ${borderRadius.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

export const ProfileContent = styled.div`
  background-color: ${colors.white};
  padding: ${spacing.xl};
  border-radius: ${borderRadius.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const SectionTitle = styled.h2`
  font-family: ${typography.fontFamilyHeading};
  font-size: ${typography.fontSizes.xl};
  color: ${colors.text};
  margin-bottom: ${spacing.lg};
  padding-bottom: ${spacing.sm};
  border-bottom: 2px solid ${colors.backgroundLight};
`;

export const LogoutButton = styled(BaseButton)`
  background-color: ${colors.danger};
  color: ${colors.white};
  width: 100%;
  margin-top: ${spacing.lg};
  
  &:hover:not(:disabled) {
    background-color: #c82333;
  }
`;

export const AvatarUploadButton = styled.button`
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

export const HiddenFileInput = styled.input`
  display: none;
`;

export const MainWrapper = styled.main`
  padding: 2rem;
  min-height: 60vh;
  background-color: #FFEBD3;
  max-width: 1400px;
  margin: 0 auto;
`;

export const Heading = styled.h1`
  color: #4a2f1b;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

export const ProfileSection = styled.section`
  margin-bottom: 3rem;
`;

export const SectionHeading = styled.h2`
  color: #4b3832;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

export const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
`;

export const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: ${borderRadius.md};
  padding: ${spacing.sm} ${spacing.md};
  font-size: ${typography.fontSizes.sm};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #c82333;
  }
`;