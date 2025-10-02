import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalBox = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;

  h2 {
    margin-top: 0;
    color: #4b3832;
    text-align: center;
  }

  label {
    display: block;
    margin: 1rem 0 0.5rem 0;
    font-weight: 600;
    color: #4b3832;
  }

  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    min-height: 100px;
    font-size: 1rem;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: #4b3832;
    }
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;

  button {
    padding: 0.75rem 1.5rem;
    border: 2px solid #4b3832;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.3s ease;

    &:first-child {
      background-color: white;
      color: #4b3832;

      &:hover {
        background-color: #f5f5f5;
      }
    }

    &:last-child {
      background-color: #4b3832;
      color: white;

      &:hover {
        background-color: #3a2b26;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background-color: #4b3832;
      }
    }
  }
`;

export const ModalError = styled.p`
  color: #d32f2f;
  background-color: rgba(211, 47, 47, 0.1);
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  text-align: center;
`;

export const Success = styled.p`
  color: #2e7d32;
  background-color: rgba(46, 125, 50, 0.1);
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  text-align: center;
`;

export const Warning = styled.p`
  color: #f57c00;
  background-color: rgba(245, 124, 0, 0.1);
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  text-align: center;
`;

export const FormLabel = styled.label`
  display: block;
  margin: 1rem 0 0.5rem 0;
  font-weight: 600;
  color: #4b3832;
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #758592;
  }
`;