import styled from 'styled-components';

export const OmOssContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
`;

export const OmOssTitle = styled.h1`
  color: #8B4513;
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'Playfair Display', serif;
`;

export const Section = styled.section`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
  color: #8B4513;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
`;

export const Paragraph = styled.p`
  line-height: 1.6;
  margin-bottom: 1rem;
  color: #333;
`;

export const ItalicParagraph = styled(Paragraph)`
  font-style: italic;
  margin-top: 2rem;
  text-align: center;
`;

export const ValuesList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const ValueItem = styled.li`
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;
  
  &:before {
    content: '🏔️';
    position: absolute;
    left: 0;
  }
`;