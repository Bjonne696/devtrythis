import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import supabase from "../../lib/supabaseClient";
import {
  LogoWrapper as Wrapper,
  LogoContainer as Container,
  LogoImg,
  Title,
  TitleContainer,
  RightSection,
  AuthButton,
  LogoLink,
  LogoImage,
} from "../../styles/layout/navigationStyles";

export default function LogoHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <Wrapper>
      <Container>
        <LogoLink to="/">
          <LogoImg src="/logo.png" alt="Logo" />
        </LogoLink>
        <TitleContainer>
          <Title>Berge Hyttene!</Title>
        </TitleContainer>
        <RightSection>
          {user ? (
            <AuthButton $isLogout onClick={handleLogout}>
              Logg ut
            </AuthButton>
          ) : (
            <AuthButton as={Link} to="/login">
              Logg inn
            </AuthButton>
          )}
        </RightSection>
      </Container>
    </Wrapper>
  );
}