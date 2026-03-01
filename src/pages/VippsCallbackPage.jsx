import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from '../components/nav/Navigation';
import Footer from '../components/nav/Footer';
import styled from 'styled-components';
import { colors, typography } from '../styles/common';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabaseClient';

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

const ManualButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 2rem;
  background-color: ${colors.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-family: ${typography.fontFamily};

  &:hover {
    background-color: ${colors.primaryHover};
  }
`;

const POLL_INTERVAL_MS = 1000;
const POLL_MAX_SECONDS = 20;

export default function VippsCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [phase, setPhase] = useState('polling');
  const pollCount = useRef(0);
  const intervalRef = useRef(null);

  const params = new URLSearchParams(location.search);
  const hasError =
    params.get('error') ||
    params.get('error_description') ||
    params.get('status') === 'error';

  useEffect(() => {
    if (hasError) {
      setPhase('error');
      return;
    }

    if (!user?.id) {
      setPhase('timeout');
      return;
    }

    const poll = async () => {
      pollCount.current += 1;

      try {
        const { data } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('owner_id', user.id)
          .eq('status', 'active')
          .limit(1);

        if (data && data.length > 0) {
          clearInterval(intervalRef.current);
          navigate('/min-profil', { replace: true, state: { vippsCallback: 'success' } });
          return;
        }
      } catch {
      }

      if (pollCount.current >= POLL_MAX_SECONDS) {
        clearInterval(intervalRef.current);
        setPhase('timeout');
      }
    };

    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [user?.id, hasError, navigate]);

  return (
    <CallbackWrapper>
      <Navigation />
      <CallbackContent>
        {phase === 'polling' && (
          <>
            <CallbackIcon>✅</CallbackIcon>
            <CallbackTitle>Takk! Vi venter på bekreftelse fra Vipps</CallbackTitle>
            <CallbackMessage>
              Vi sjekker abonnementsstatus automatisk. Du sendes til profilen din så snart betalingen er bekreftet.
            </CallbackMessage>
            <Spinner />
          </>
        )}

        {phase === 'timeout' && (
          <>
            <CallbackIcon>⏳</CallbackIcon>
            <CallbackTitle>Betalingen behandles fortsatt</CallbackTitle>
            <CallbackMessage>
              Vi kunne ikke bekrefte abonnementet innen forventet tid. Dette er normalt – Vipps kan bruke litt ekstra tid.
              Gå til profilen din for å se oppdatert status.
            </CallbackMessage>
            <ManualButton onClick={() => navigate('/min-profil', { replace: true, state: { vippsCallback: 'success' } })}>
              Gå til Min profil
            </ManualButton>
          </>
        )}

        {phase === 'error' && (
          <>
            <CallbackIcon>⚠️</CallbackIcon>
            <CallbackTitle>Noe gikk galt hos Vipps</CallbackTitle>
            <CallbackMessage>
              Betalingen ble ikke fullført. Du kan prøve igjen fra profilen din.
            </CallbackMessage>
            <ManualButton onClick={() => navigate('/min-profil', { replace: true })}>
              Gå til Min profil
            </ManualButton>
          </>
        )}
      </CallbackContent>
      <Footer />
    </CallbackWrapper>
  );
}
