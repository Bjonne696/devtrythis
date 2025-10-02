import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../lib/supabaseClient';
import {
  SignInWrapper,
  Heading,
  Form,
  LabelGroup,
  Label,
  Input,
  Error,
  ForgotPasswordButton,
  RegisterInfo
} from "../../styles/auth/signInStyles";
import { Button } from "../../styles/common/index";

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "E-post er påkrevd";
    } else if (!validateEmail(email)) {
      newErrors.email = "Ugyldig e-postformat";
    }

    if (!password) {
      newErrors.password = "Passord er påkrevd";
    } else if (password.length < 6) {
      newErrors.password = "Passord må være minst 6 tegn";
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      alert('Du er nå logget inn!');
      navigate("/");
    }

    setLoading(false);
  };

  return (
    <SignInWrapper>
      <Heading>Logg inn på din hyttekonto</Heading>
      <Form onSubmit={handleSignIn} aria-labelledby="signin-form">
        <LabelGroup>
          <Label htmlFor="email">E-postadresse</Label>
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ borderColor: fieldErrors.email ? '#d32f2f' : '#ccc' }}
          />
          {fieldErrors.email && (
            <Error style={{ fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
              {fieldErrors.email}
            </Error>
          )}
        </LabelGroup>

        <LabelGroup>
          <Label htmlFor="password">Passord</Label>
          <Input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ borderColor: fieldErrors.password ? '#d32f2f' : '#ccc' }}
          />
          {fieldErrors.password && (
            <Error style={{ fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
              {fieldErrors.password}
            </Error>
          )}
        </LabelGroup>

        {error && <Error role="alert">{error}</Error>}

        <ForgotPasswordButton type="button">Glemt passord?</ForgotPasswordButton>

        <Button $variant="primary" type="submit" disabled={loading}>
          {loading ? 'Logger inn...' : 'Logg inn'}
        </Button>

        <RegisterInfo>Ikke registrert? Registrer deg her!</RegisterInfo>
        <Button $variant="secondary" type="button" onClick={() => navigate('/register')}>
          Registrer deg
        </Button>
      </Form>
    </SignInWrapper>
  );
}

export default SignIn;