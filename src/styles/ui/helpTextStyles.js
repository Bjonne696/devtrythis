import styled from 'styled-components';

export const HelpTextContainer = styled.div`
  background-color: #e8f4f8;
  border: 1px solid #bee5eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #0c5460;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const HelpIcon = styled.div`
  background-color: #17a2b8;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
`;

export const HelpContent = styled.div`
  line-height: 1.5;

  ul {
    margin: 0.5rem 0;
    padding-left: 1.25rem;
  }

  li {
    margin: 0.25rem 0;
  }
`;
