import { useState } from "react";
import { ImageGrid, ImageModal, ModalBackdrop, ModalImage, CloseButton, ThumbnailImage } from "../../styles/cabins/cabinStyles";

export default function CabinImages({ imageUrls }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    return <p>Ingen bilder tilgjengelig</p>;
  }

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <ImageGrid>
        {imageUrls.map((url, idx) => (
          <ThumbnailImage 
            key={idx} 
            src={url} 
            alt={`Hyttebilde ${idx + 1}`}
            onClick={() => openModal(url)}
          />
        ))}
      </ImageGrid>

      {selectedImage && (
        <ModalBackdrop onClick={closeModal}>
          <ImageModal onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <ModalImage src={selectedImage} alt="Forstørret hyttebilde" />
          </ImageModal>
        </ModalBackdrop>
      )}
    </>
  );
}