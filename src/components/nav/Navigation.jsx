import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import supabase from "../../lib/supabaseClient";
import {
  NavBar,
  NavContainer,
  LogoSection,
  LogoLink,
  CompactLogo,
  NavSection,
  NavList,
  NavItem,
  NavLink,
  AuthSection,
  AuthButton,
  HamburgerButton,
  MobileMenu
} from "../../styles/layout/navigationStyles";

export default function Navigation() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <NavBar>
      <NavContainer>
        <LogoSection>
          <LogoLink to="/" onClick={closeMenu}>
            <CompactLogo src="/logo.png" alt="Berge Hyttene" />
          </LogoLink>
        </LogoSection>

        <NavSection>
          <NavList>
            <NavItem>
              <NavLink to="/" $active={location.pathname === "/"} onClick={closeMenu}>
                Hjem
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/til-leie" $active={location.pathname === "/til-leie"} onClick={closeMenu}>
                Til leie
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/nye-hytter" $active={location.pathname === "/nye-hytter"} onClick={closeMenu}>
                Nye Hytter
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/popular" $active={location.pathname === "/popular"} onClick={closeMenu}>
                Populære
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/kontakt" $active={location.pathname === "/kontakt"} onClick={closeMenu}>
                Kontakt
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/om-oss" $active={location.pathname === "/om-oss"} onClick={closeMenu}>
                Om oss
              </NavLink>
            </NavItem>
            {profile && (
              <NavItem>
                <NavLink to="/min-profil" $active={location.pathname === "/min-profil"} onClick={closeMenu}>
                  Min Profil
                </NavLink>
              </NavItem>
            )}
            {profile?.role === "admin" && (
              <NavItem>
                <NavLink to="/admin" $active={location.pathname === "/admin"} onClick={closeMenu}>
                  Admin
                </NavLink>
              </NavItem>
            )}
          </NavList>
        </NavSection>

        <AuthSection>
          <HamburgerButton onClick={toggleMenu}>
            {isMenuOpen ? '✕' : '☰'}
          </HamburgerButton>
          {user ? (
            <AuthButton $isLogout onClick={handleLogout}>
              Logg ut
            </AuthButton>
          ) : (
            <AuthButton as={Link} to="/login">
              Logg inn
            </AuthButton>
          )}
        </AuthSection>

        <MobileMenu $isOpen={isMenuOpen}>
          <NavList>
            <NavItem>
              <NavLink to="/" $active={location.pathname === "/"} onClick={closeMenu}>
                Hjem
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/til-leie" $active={location.pathname === "/til-leie"} onClick={closeMenu}>
                Til leie
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/nye-hytter" $active={location.pathname === "/nye-hytter"} onClick={closeMenu}>
                Nye Hytter
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/popular" $active={location.pathname === "/popular"} onClick={closeMenu}>
                Populære
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/kontakt" $active={location.pathname === "/kontakt"} onClick={closeMenu}>
                Kontakt
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/om-oss" $active={location.pathname === "/om-oss"} onClick={closeMenu}>
                Om oss
              </NavLink>
            </NavItem>
            {profile && (
              <NavItem>
                <NavLink to="/min-profil" $active={location.pathname === "/min-profil"} onClick={closeMenu}>
                  Min Profil
                </NavLink>
              </NavItem>
            )}
            {profile?.role === "admin" && (
              <NavItem>
                <NavLink to="/admin" $active={location.pathname === "/admin"} onClick={closeMenu}>
                  Admin
                </NavLink>
              </NavItem>
            )}
            <NavItem>
              {user ? (
                <NavLink as="button" onClick={handleLogout}>
                  Logg ut
                </NavLink>
              ) : (
                <NavLink to="/login" onClick={closeMenu}>
                  Logg inn
                </NavLink>
              )}
            </NavItem>
          </NavList>
        </MobileMenu>
      </NavContainer>
    </NavBar>
  );
}
