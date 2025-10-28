import styled from 'styled-components';

export const TermsContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;
  background: white;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

export const PageTitle = styled.h1`
  color: #4b3832;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const LastUpdated = styled.p`
  text-align: center;
  color: #6c757d;
  font-size: 0.95rem;
  margin-bottom: 3rem;
`;

export const Section = styled.section`
  margin-bottom: 3rem;
`;

export const SectionTitle = styled.h2`
  color: #4b3832;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const SubTitle = styled.h3`
  color: #4b3832;
  font-size: 1.3rem;
  margin-top: 1.5rem;
  margin-bottom: 0.8rem;
`;

export const Paragraph = styled.p`
  color: #495057;
  line-height: 1.8;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

export const List = styled.ul`
  color: #495057;
  line-height: 1.8;
  margin-bottom: 1rem;
  padding-left: 2rem;

  li {
    margin-bottom: 0.5rem;
  }
`;

export const ContactBox = styled.div`
  background: #f8f9fa;
  border-left: 4px solid #667eea;
  padding: 1.5rem;
  margin: 2rem 0;
  border-radius: 4px;
`;

export const ContactInfo = styled.div`
  color: #495057;
  line-height: 1.8;

  strong {
    color: #4b3832;
  }

  a {
    color: #667eea;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;
