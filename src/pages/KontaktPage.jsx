import React, { useState } from 'react';
import { PageWrapper, MainContent } from "../styles/layout/pageStyles.js";
import Header from '../components/nav/Header.jsx';
import Footer from '../components/nav/Footer.jsx';
import LogoHeader from '../components/nav/LogoHeader.jsx';
import {
  FormWrapper,
  FormTitle,
  Form,
  FormRow,
  FormGroup,
  Label,
  Input,
  TextArea
} from '../styles/cabins/newCabinFormStyles.js';
import { SubmitButton } from '../styles/cabins/cabinStyles.js';
import { Error as ErrorMessage } from '../styles/auth/signInStyles.js';

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validering
    if (!formData.name.trim()) {
      setError('Navn er påkrevd');
      return;
    }
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setError('Gyldig e-postadresse er påkrevd');
      return;
    }
    if (!formData.subject.trim()) {
      setError('Emne er påkrevd');
      return;
    }
    if (!formData.message.trim()) {
      setError('Melding er påkrevd');
      return;
    }

    setLoading(true);

    try {
      // Send kontaktskjema via Supabase Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Feil ved sending av melding');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError(err.message || 'Det oppstod en feil ved sending av meldingen. Prøv igjen senere.');
      console.error('Kontaktskjema feil:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <LogoHeader />
      <Header />
      <MainContent>
        <FormWrapper>
          <FormTitle>Kontakt Oss</FormTitle>

          <div style={{ marginBottom: '2rem', textAlign: 'center', color: '#666' }}>
            <p>Vi vil gjerne høre fra deg! Send oss en melding så svarer vi så snart som mulig.</p>
            <p><strong>E-post:</strong> Anitaberge@yahoo.no</p>
          </div>

          {success && (
            <div style={{
              backgroundColor: '#d4edda',
              color: '#155724',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #c3e6cb'
            }}>
              <strong>Takk for din henvendelse!</strong><br />
              Vi har mottatt meldingen din og vil svare så snart som mulig.
            </div>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Form onSubmit={handleSubmit}>
            <FormRow $columns="1fr 1fr">
              <FormGroup>
                <Label>Navn *</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ditt fulle navn"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>E-post *</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="din@epost.no"
                  required
                />
              </FormGroup>
            </FormRow>

            <FormRow $columns="1fr 1fr">
              <FormGroup>
                <Label>Telefon (valgfritt)</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="12 34 56 78"
                />
              </FormGroup>

              <FormGroup>
                <Label>Emne *</Label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Hva gjelder henvendelsen?"
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>Melding *</Label>
              <TextArea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Skriv din melding her..."
                rows="6"
                required
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Sender...' : 'Send melding'}
            </SubmitButton>
          </Form>

          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '0.5rem' }}>
            <h3 style={{ color: '#4b3832', marginBottom: '1rem' }}>Andre måter å kontakte oss på:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <strong>E-post:</strong><br />
                <a href="mailto:Anitaberge@yahoo.no" style={{ color: '#4b3832' }}>Anitaberge@yahoo.no</a>
              </div>
              <div>
                <strong>Responstid:</strong><br />
                Vanligvis innen 24 timer
              </div>
            </div>
          </div>
        </FormWrapper>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}