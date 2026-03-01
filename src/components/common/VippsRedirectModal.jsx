import React from "react";
import {
  ModalOverlay,
  ModalBox,
  ButtonRow,
  CloseButton
} from "../../styles/ui/modalStyles";

export default function VippsRedirectModal({ url, onClose }) {
  return (
    <ModalOverlay>
      <ModalBox>
        <CloseButton onClick={onClose} aria-label="Lukk">&times;</CloseButton>
        <h2>Fortsett til Vipps</h2>
        <p>Du blir sendt til Vipps for å bekrefte abonnementet.</p>
        <ButtonRow>
          <button type="button" onClick={onClose}>
            Avbryt
          </button>
          <button type="button" onClick={() => window.location.assign(url)}>
            Fortsett til Vipps
          </button>
        </ButtonRow>
      </ModalBox>
    </ModalOverlay>
  );
}
