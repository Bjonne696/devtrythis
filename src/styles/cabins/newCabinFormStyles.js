
import styled from "styled-components";

export const FormWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const FormTitle = styled.h2`
  color: #4b3832;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$columns || '1fr'};
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: 500;
  color: #4b3832;
  font-size: 1rem;
`;

export const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4b3832;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #4b3832;
  }
`;

export const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #4b3832;
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  input[type="checkbox"] {
    width: auto;
    margin: 0;
  }
`;

export const FileUploadSection = styled.div`
  border: 2px dashed #e0e0e0;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  background-color: #f9f9f9;
  
  &.dragover {
    border-color: #4b3832;
    background-color: #f0f8f0;
  }
`;

export const FileInput = styled.input`
  display: none;
`;

export const FileInputLabel = styled.label`
  background-color: #4b3832;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  display: inline-block;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: #5a4139;
  }
`;

export const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

export const ImagePreview = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.5rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(220, 53, 69, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: rgba(220, 53, 69, 1);
  }
`;

export const SubmitButton = styled.button`
  background-color: #4b3832;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 1rem;
  align-self: center;
  
  &:hover {
    background-color: #5a4139;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border-left: 4px solid #c33;
  margin: 1rem 0;
`;

export const HelpText = styled.p`
  color: #666;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-style: italic;
`;
