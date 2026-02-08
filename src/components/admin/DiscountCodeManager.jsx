import React, { useState, useEffect } from 'react';
import supabase from '../../lib/supabaseClient';
import {
  Wrapper,
  Title,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Select,
  Button,
  CodesTable,
  Th,
  Td,
  StatusBadge,
  SuccessMessage,
  EmptyMessage,
  ActionGroup
} from '../../styles/admin/discountCodeManagerStyles';

export default function DiscountCodeManager() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    code: '',
    duration_months: 1,
    valid_until: '',
    description: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchCodes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Feil ved henting av rabattkoder:', error);
      setErrorMessage('Kunne ikke hente rabattkoder. Sjekk at tabellen finnes i databasen.');
    } else {
      setCodes(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code || !formData.valid_until) {
      alert('Vennligst fyll ut alle felt');
      return;
    }

    const { data, error } = await supabase
      .from('discount_codes')
      .insert({
        code: formData.code.toUpperCase(),
        duration_months: parseInt(formData.duration_months),
        valid_until: formData.valid_until,
        description: formData.description || null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        setErrorMessage(`Rabattkoden "${formData.code.toUpperCase()}" finnes allerede.`);
      } else {
        console.error('Feil ved oppretting av rabattkode:', error);
        setErrorMessage('Kunne ikke opprette rabattkode. Sjekk at du har admin-rettigheter.');
      }
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    setCodes([data, ...codes]);
    setFormData({ code: '', duration_months: 1, valid_until: '', description: '' });
    setErrorMessage('');
    setSuccessMessage(`Rabattkode "${data.code}" opprettet!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Er du sikker på at du vil slette rabattkoden "${code}"?`)) {
      return;
    }

    const { error } = await supabase
      .from('discount_codes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Feil ved sletting av rabattkode:', error);
      setErrorMessage('Kunne ikke slette rabattkoden.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    setCodes(codes.filter(c => c.id !== id));
    setErrorMessage('');
    setSuccessMessage(`Rabattkode "${code}" slettet.`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const toggleActive = async (id) => {
    const code = codes.find(c => c.id === id);
    if (!code) return;

    const { error } = await supabase
      .from('discount_codes')
      .update({ is_active: !code.is_active })
      .eq('id', id);

    if (error) {
      console.error('Feil ved endring av status:', error);
      setErrorMessage('Kunne ikke endre status på rabattkoden.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    setCodes(codes.map(c =>
      c.id === id ? { ...c, is_active: !c.is_active } : c
    ));
  };

  const isExpired = (validUntil) => {
    return new Date(validUntil) < new Date();
  };

  if (loading) {
    return (
      <Wrapper>
        <Title>Rabattkoder</Title>
        <EmptyMessage>Laster rabattkoder...</EmptyMessage>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Title>Rabattkoder</Title>

      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      {errorMessage && <SuccessMessage style={{ background: '#fff0f0', color: '#c00' }}>{errorMessage}</SuccessMessage>}

      <form onSubmit={handleSubmit}>
        <FormGrid>
          <FormGroup>
            <Label>Kode-navn *</Label>
            <Input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="SUMMER2025"
              maxLength={20}
            />
          </FormGroup>

          <FormGroup>
            <Label>Varighet (måneder gratis) *</Label>
            <Select
              value={formData.duration_months}
              onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
            >
              <option value="1">1 måned</option>
              <option value="2">2 måneder</option>
              <option value="3">3 måneder</option>
              <option value="6">6 måneder</option>
              <option value="12">12 måneder</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Gyldig til dato *</Label>
            <Input
              type="date"
              value={formData.valid_until}
              onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </FormGroup>

          <FormGroup>
            <Label>Beskrivelse (valgfritt)</Label>
            <Input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Velkomsttilbud - 1 mnd gratis"
            />
          </FormGroup>

          <FormGroup className="align-end">
            <Button type="submit">Opprett rabattkode</Button>
          </FormGroup>
        </FormGrid>
      </form>

      <CodesTable>
        <thead>
          <tr>
            <Th>Kode</Th>
            <Th>Varighet</Th>
            <Th>Gyldig til</Th>
            <Th>Beskrivelse</Th>
            <Th>Status</Th>
            <Th>Handlinger</Th>
          </tr>
        </thead>
        <tbody>
          {codes.map((code) => (
            <tr key={code.id}>
              <Td data-label="Kode"><strong>{code.code}</strong></Td>
              <Td data-label="Varighet">{code.duration_months} måned{code.duration_months > 1 ? 'er' : ''} gratis</Td>
              <Td data-label="Gyldig til">{new Date(code.valid_until).toLocaleDateString('nb-NO')}</Td>
              <Td data-label="Beskrivelse">{code.description || '—'}</Td>
              <Td data-label="Status">
                {isExpired(code.valid_until) ? (
                  <StatusBadge $active={false}>Utløpt</StatusBadge>
                ) : (
                  <StatusBadge $active={code.is_active}>
                    {code.is_active ? 'Aktiv' : 'Inaktiv'}
                  </StatusBadge>
                )}
              </Td>
              <Td data-label="Handlinger">
                <ActionGroup>
                  <Button
                    onClick={() => toggleActive(code.id)}
                    className="small"
                    disabled={isExpired(code.valid_until)}
                  >
                    {code.is_active ? 'Deaktiver' : 'Aktiver'}
                  </Button>
                  <Button
                    $variant="delete"
                    onClick={() => handleDelete(code.id, code.code)}
                    className="small"
                  >
                    Slett
                  </Button>
                </ActionGroup>
              </Td>
            </tr>
          ))}
        </tbody>
      </CodesTable>

      {codes.length === 0 && (
        <EmptyMessage>
          Ingen rabattkoder opprettet enda.
        </EmptyMessage>
      )}
    </Wrapper>
  );
}
