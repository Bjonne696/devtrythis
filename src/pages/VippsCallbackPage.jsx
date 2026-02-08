import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/nav/Navigation';
import Footer from '../components/nav/Footer';
import styled from 'styled-components';
import { colors, typography } from '../styles/common';

const CallbackWrapper = styled.div`
  min-height: 100vh;
  background: ${colors.background};
  display: flex;
  flex-direction: column;
`;

const CallbackContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

const CallbackIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

const CallbackTitle = styled.h1`
  font-family: ${typography.fontFamilyHeading};
  font-size: 2rem;
  color: ${colors.text};
  margin-bottom: 1rem;
`;

const CallbackMessage = styled.p`
  font-size: 1.1rem;
  color: ${colors.textLight};
  max-width: 500px;
  line-height: 1.6;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${colors.border};
  border-top: 4px solid ${colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 1.5rem auto;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function VippsCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('redirecting');
      navigate('/min-profil', { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <CallbackWrapper>
      <Navigation />
      <CallbackContent>
        {status === 'processing' && (
          <>
            <CallbackIcon>✅</CallbackIcon>
            <CallbackTitle>Takk for betalingen!</CallbackTitle>
            <CallbackMessage>
              Vi behandler abonnementet ditt. Du blir sendt til profilen din om et øyeblikk...
            </CallbackMessage>
            <Spinner />
          </>
        )}
        {status === 'redirecting' && (
          <>
            <CallbackIcon>🏠</CallbackIcon>
            <CallbackTitle>Sender deg til profilen...</CallbackTitle>
            <Spinner />
          </>
        )}
      </CallbackContent>
      <Footer />
    </CallbackWrapper>
  );
}
