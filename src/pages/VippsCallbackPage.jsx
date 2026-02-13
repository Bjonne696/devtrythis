import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  max-width: 520px;
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
  const location = useLocation();
  const [phase, setPhase] = useState('processing');

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  useEffect(() => {
    // Vi "behandler" kort for UX, men redirecter raskt.
    // Webhooken er source of truth uansett – min-profil viser status der.
    const hasError =
      params.get('error') ||
      params.get('error_description') ||
      params.get('status') === 'error';

    if (hasError) {
      // Hvis Vipps sender feil i querystring, send bruker til min-profil men med hint
      setPhase('error');
      const t = setTimeout(() => {
        navigate('/min-profil', { replace: true, state: { vippsCallback: 'error' } });
      }, 1200);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setPhase('redirecting');
      navigate('/min-profil', { replace: true, state: { vippsCallback: 'success' } });
    }, 800);

    return () => clearTimeout(t);
  }, [navigate, params]);

  return (
    <CallbackWrapper>
      <Navigation />
      <CallbackContent>
        {phase === 'processing' && (
          <>
            <CallbackIcon>✅</CallbackIcon>
            <CallbackTitle>Takk! Vi behandler abonnementet ditt</CallbackTitle>
            <CallbackMessage>
              Du blir sendt til profilen din straks. Der kan du se status på abonnementet.
            </CallbackMessage>
            <Spinner />
          </>
        )}

        {phase === 'redirecting' && (
          <>
            <CallbackIcon>🏠</CallbackIcon>
            <CallbackTitle>Sender deg til profilen…</CallbackTitle>
            <Spinner />
          </>
        )}

        {phase === 'error' && (
          <>
            <CallbackIcon>⚠️</CallbackIcon>
            <CallbackTitle>Noe gikk galt hos Vipps</CallbackTitle>
            <CallbackMessage>
              Vi sender deg til profilen din, så du kan prøve igjen.
            </CallbackMessage>
            <Spinner />
          </>
        )}
      </CallbackContent>
      <Footer />
    </CallbackWrapper>
  );
}
