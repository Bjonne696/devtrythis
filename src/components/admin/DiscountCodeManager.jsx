import React, { useState } from 'react';
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
  const [codes, setCodes] = useState([
    {
      id: 1,
      code: 'SUMMER2025',
      duration_months: 2,
      valid_until: '2025-12-31',
      is_active: true,
    }
  ]);

  const [formData, setFormData] = useState({
    code: '',
    duration_months: 1,
    valid_until: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.code || !formData.valid_until) {
      alert('Vennligst fyll ut alle felt');
      return;
    }

    const newCode = {
      id: Date.now(),
      code: formData.code.toUpperCase(),
      duration_months: parseInt(formData.duration_months),
      valid_until: formData.valid_until,
      is_active: true,
    };

    setCodes([...codes, newCode]);
    setFormData({ code: '', duration_months: 1, valid_until: '' });
    setSuccessMessage(`Rabattkode "${newCode.code}" opprettet!`);
    
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Er du sikker på at du vil slette denne rabattkoden?')) {
      setCodes(codes.filter(code => code.id !== id));
    }
  };

  const toggleActive = (id) => {
    setCodes(codes.map(code => 
      code.id === id ? { ...code, is_active: !code.is_active } : code
    ));
  };

  const isExpired = (validUntil) => {
    return new Date(validUntil) < new Date();
  };

  return (
    <Wrapper>
      <Title>🎟️ Rabattkoder</Title>

      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

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
                    onClick={() => handleDelete(code.id)}
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
