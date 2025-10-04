import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #4b3832;
  margin: 0 0 1.5rem 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #4b3832;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  background: ${props => props.$variant === 'delete' ? '#dc3545' : '#667eea'};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$variant === 'delete' ? '#c82333' : '#5568d3'};
  }
`;

const CodesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
`;

const Th = styled.th`
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4b3832;
  border-bottom: 2px solid #dee2e6;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${props => props.$active ? '#d4edda' : '#f8d7da'};
  color: ${props => props.$active ? '#155724' : '#721c24'};
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

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

          <FormGroup style={{ alignSelf: 'flex-end' }}>
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
              <Td><strong>{code.code}</strong></Td>
              <Td>{code.duration_months} måned{code.duration_months > 1 ? 'er' : ''} gratis</Td>
              <Td>{new Date(code.valid_until).toLocaleDateString('nb-NO')}</Td>
              <Td>
                {isExpired(code.valid_until) ? (
                  <StatusBadge $active={false}>Utløpt</StatusBadge>
                ) : (
                  <StatusBadge $active={code.is_active}>
                    {code.is_active ? 'Aktiv' : 'Inaktiv'}
                  </StatusBadge>
                )}
              </Td>
              <Td>
                <Button 
                  onClick={() => toggleActive(code.id)} 
                  style={{ marginRight: '0.5rem', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                  disabled={isExpired(code.valid_until)}
                >
                  {code.is_active ? 'Deaktiver' : 'Aktiver'}
                </Button>
                <Button 
                  $variant="delete" 
                  onClick={() => handleDelete(code.id)}
                  style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  Slett
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </CodesTable>

      {codes.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6c757d', marginTop: '2rem' }}>
          Ingen rabattkoder opprettet enda.
        </p>
      )}
    </Wrapper>
  );
}
