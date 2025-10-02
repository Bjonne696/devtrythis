import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  NavWrapper,
  NavContainer,
  HamburgerMenuButton,
  Nav,
  NavList,
  NavigationItem,
  NavigationLink
} from '../../styles/layout/navigationStyles';

export default function Header() {
  const location = useLocation();
  const { profile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <NavWrapper>
      <NavContainer>
        <HamburgerMenuButton onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </HamburgerMenuButton>
        <Nav $isOpen={isMenuOpen}>
          <NavList style={{ textAlign: 'center' }}>
            <NavigationItem><NavigationLink to="/" $active={location.pathname === "/"} onClick={closeMenu}>Hjem</NavigationLink></NavigationItem>
            <NavigationItem><NavigationLink to="/til-leie" $active={location.pathname === "/til-leie"} onClick={closeMenu}>Til leie</NavigationLink></NavigationItem>
            <NavigationItem><NavigationLink to="/nye-hytter" $active={location.pathname === "/nye-hytter"} onClick={closeMenu}>Nye Hytter</NavigationLink></NavigationItem>
            <NavigationItem><NavigationLink to="/popular" $active={location.pathname === "/popular"} onClick={closeMenu}>Populære</NavigationLink></NavigationItem>
            <NavigationItem><NavigationLink to="/kontakt" $active={location.pathname === "/kontakt"} onClick={closeMenu}>Kontakt</NavigationLink></NavigationItem>
            <NavigationItem><NavigationLink to="/om-oss" $active={location.pathname === "/om-oss"} onClick={closeMenu}>Om oss</NavigationLink></NavigationItem>
            {profile && (
              <NavigationItem>
                <NavigationLink to="/min-profil" $active={location.pathname === "/min-profil"} onClick={closeMenu}>
                  Min Profil
                </NavigationLink>
              </NavigationItem>
            )}

            {/* Kun synlig for admin-brukere */}
            {profile?.role === "admin" && (
              <NavigationItem><NavigationLink to="/admin" $active={location.pathname === "/admin"} onClick={closeMenu}>Admin</NavigationLink></NavigationItem>
            )}
          </NavList>
        </Nav>
      </NavContainer>
    </NavWrapper>
  );
}