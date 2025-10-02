import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import {
  colors,
  spacing,
  borderRadius,
  typography,
  media,
  breakpoints
} from '../common/index.js';

// Header styles
export const HeaderContainer = styled.header`
  background-color: ${colors.primary};
  color: ${colors.white};
  padding: ${spacing.md} ${spacing.xl};
  position: sticky;
  top: 0;
  z-index: 100;

  ${media.md} {
    padding: ${spacing.md};
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
`;

export const LogoImg = styled.img`
  height: 72px;
  width: auto;
  cursor: pointer;

  ${media.md} {
    height: 60px;
  }
`;

export const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  
`;

export const LogoImage = styled.img`
  height: 60px;
  width: auto;
  margin-right: ${spacing.md};

  ${media.md} {
    height: 50px;
  }
`;

export const HamburgerMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #efede3;
  font-size: ${typography.fontSizes.xl};
  cursor: pointer;
  padding: ${spacing.sm};
  z-index: 1001;

  ${media.md} {
    display: block;
  }

  &:hover {
    color: ${colors.background};
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export const Title = styled.h1`
  font-size: calc(${typography.fontSizes['3xl']} * 1.575);
  font-weight: ${typography.fontWeights.bold};
  margin: 0;
  color: ${colors.text};
  text-align: center;
  padding: ${spacing.sm} 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 1200px) {
    font-size: calc(${typography.fontSizes['2xl']} * 1.4);
  }

  @media (max-width: 768px) {
    font-size: calc(${typography.fontSizes.xl} * 1.3);
  }

  @media (max-width: 480px) {
    font-size: calc(${typography.fontSizes.lg} * 1.2);
  }
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

export const AuthButton = styled.button`
  background-color: ${props => props.$isLogout ? colors.error : colors.accent};
  color: ${colors.white};
  border: none;
  padding: ${spacing.sm} ${spacing.lg};
  border-radius: ${borderRadius.base};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.$isLogout ? '#c53030' : colors.accentHover || '#236b6d'};
  }
`;

export const LogoWrapper = styled.header`
  background-color: ${colors.background};
  color: ${colors.white};
  padding: ${spacing.sm} ${spacing.lg};
  position: sticky;
  top: 0;
  z-index: 101;
  margin-bottom: 0;
  height: calc(72px + ${spacing.sm} * 2);
  display: flex;
  align-items: center;
  width: 100%;

  ${media.md} {
    padding: ${spacing.sm};
    height: calc(60px + ${spacing.sm} * 2);
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

export const NavWrapper = styled.nav`
  background-color: ${colors.secondary};
  padding: ${spacing.md} 0;
  position: sticky;
  top: calc(72px + ${spacing.sm} * 2);
  z-index: 100;
  margin-top: 0;
  margin-bottom: 0;
  border-top: 2px solid ${colors.primary};
  border-bottom: 2px solid ${colors.primary};
  width: 100%;

  ${media.md} {
    top: calc(60px + ${spacing.sm} * 2);
  }
`;

export const NavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  ${media.md} {
    justify-content: flex-end;
  }
`;

export const Nav = styled.nav`
  ${media.md} {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${colors.secondary};
    display: ${props => props.$isOpen ? 'block' : 'none'};
    padding: ${spacing.md};
  }
`;

export const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
  justify-content: center;
  width: 100%;

  ${media.md} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const NavigationItem = styled.li`
  list-style: none;

  ${media.md} {
    margin: ${spacing.sm} 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:last-child {
      border-bottom: none;
    }
  }
`;

export const NavigationLink = styled(Link)`
  color: ${colors.white};
  text-decoration: none;
  font-weight: ${typography.fontWeights.medium};
  font-size: ${typography.fontSizes.base};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.base};
  transition: all 0.3s ease;
  display: block;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: ${colors.white};
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

// Footer styles
export const FooterContainer = styled.footer`
  background-color: ${colors.secondary};
  color: ${colors.white};
  padding: ${spacing.xl} ${spacing.md};
  margin-top: auto;
  border-top: 2px solid ${colors.primary};
`;

export const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${spacing.xl};
  text-align: center;

  ${media.md} {
    grid-template-columns: 1fr;
    gap: ${spacing.lg};
  }
`;

export const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.sm};

  p {
    margin: 0;
    font-size: ${typography.fontSizes.sm};
    color: ${colors.white};
  }
`;

export const FooterSpan = styled.span`
  font-weight: ${typography.fontWeights.semibold};
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: ${spacing.md};
  justify-content: center;
`;

export const IconWrapper = styled.div`
  color: ${colors.white};
  font-size: ${typography.fontSizes.lg};
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: ${colors.textMuted};
  }
`;

export const Logo = styled.img`
  height: 40px;
  width: auto;

  ${media.md} {
    height: 35px;
  }
`;