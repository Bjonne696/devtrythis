import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../lib/supabaseClient';
import Tooltip from '../ui/Tooltip';
import HelpText from '../ui/HelpText';
import {
  SignUpWrapper,
  Heading,
  Form,
  FormGroup,
  Label,
  Input,
  Error,
  FieldError,
  Button
} from '../../styles/auth/signUpStyles';

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /\d/.test(password),
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "Fornavn er påkrevd";
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = "Fornavn må være minst 2 tegn";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Etternavn er påkrevd";
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = "Etternavn må være minst 2 tegn";
    }

    if (!email.trim()) {
      newErrors.email = "E-post er påkrevd";
    } else if (!validateEmail(email)) {
      newErrors.email = "Ugyldig e-postformat";
    }

    const passwordValidation = validatePassword(password);
    if (!password) {
      newErrors.password = "Passord er påkrevd";
    } else if (!passwordValidation.length) {
      newErrors.password = "Passord må være minst 8 tegn";
    } else if (!passwordValidation.hasLetter) {
      newErrors.password = "Passord må inneholde minst én bokstav";
    } else if (!passwordValidation.hasNumber) {
      newErrors.password = "Passord må inneholde minst ett tall";
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    const { error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      setError('Kunne ikke hente bruker-ID etter registrering.');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      name: firstName,
      last_name: lastName,
      region,
      role: 'bruker',
    });

    if (insertError) {
      console.error('INSERT ERROR:', insertError);
      setError(insertError.message);
    } else {
      const redirectPath = sessionStorage.getItem('redirectAfterAuth');
      sessionStorage.removeItem('redirectAfterAuth');
      navigate(redirectPath || '/min-profil');
    }

    setLoading(false);
  };


  return (
    <SignUpWrapper>
      <Heading>Opprett konto</Heading>

      <HelpText icon="🎯">
        <strong>Velkommen til Ferieplassen!</strong><br />
        Opprett din konto for å leie ut din feriebolig eller finne drømmeboligen.
        Alle felt merket med * er påkrevd.
      </HelpText>

      <Form onSubmit={handleSignUp} aria-labelledby="signup-form">
        <FormGroup>
          <Label htmlFor="firstName">Fornavn</Label>
          <Input
            id="firstName"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            $hasError={!!fieldErrors.firstName}
          />
          {fieldErrors.firstName && (
            <FieldError>
              {fieldErrors.firstName}
            </FieldError>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="lastName">Etternavn</Label>
          <Input
            id="lastName"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            $hasError={!!fieldErrors.lastName}
          />
          {fieldErrors.lastName && (
            <FieldError>
              {fieldErrors.lastName}
            </FieldError>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">E-postadresse</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            $hasError={!!fieldErrors.email}
          />
          {fieldErrors.email && (
            <FieldError>
              {fieldErrors.email}
            </FieldError>
          )}
        </FormGroup>

        <FormGroup>
          <Tooltip text="Passordet bør være minst 8 tegn langt og inneholde både bokstaver og tall for sikkerhet.">
            <Label htmlFor="password">Passord</Label>
          </Tooltip>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minst 8 tegn, bokstaver og tall"
            $hasError={!!fieldErrors.password}
          />
          {fieldErrors.password && (
            <FieldError>
              {fieldErrors.password}
            </FieldError>
          )}
        </FormGroup>

        <FormGroup>
          <Tooltip text="Området ditt hjelper andre brukere å finne lokale feriebolig og gir deg relevante anbefalinger.">
            <Label htmlFor="region">Område (valgfritt)</Label>
          </Tooltip>
          <Input
            id="region"
            type="text"
            placeholder="Eks: Akershus, Oslo, Nordland..."
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </FormGroup>

        {error && <Error role="alert">{error}</Error>}

        <Button type="submit" disabled={loading}>
          {loading ? 'Registrerer...' : 'Registrer deg'}
        </Button>
      </Form>
    </SignUpWrapper>
  );
}

export default SignUp;