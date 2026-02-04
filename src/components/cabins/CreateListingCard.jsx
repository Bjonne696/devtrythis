import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  CreateListingLink,
  CreateListingCardWrapper,
  CreateListingIconSection,
  CreateListingIcon,
  CreateListingInfo,
  CreateListingTitle,
  CreateListingDescription,
  CreateListingCTA
} from '../../styles/cabins/createListingCardStyles';

export default function CreateListingCard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/ny-hytte');
    } else {
      sessionStorage.setItem('redirectAfterAuth', '/ny-hytte');
      navigate('/registrer');
    }
  };

  return (
    <CreateListingCardWrapper onClick={handleClick}>
      <CreateListingIconSection>
        <CreateListingIcon>🏠</CreateListingIcon>
      </CreateListingIconSection>
      <CreateListingInfo>
        <CreateListingTitle>Leie ut din hytte?</CreateListingTitle>
        <CreateListingDescription>
          Del din hytte med andre og tjen ekstra inntekt på feriedager du ikke bruker den.
        </CreateListingDescription>
        <CreateListingCTA>
          {user ? 'Opprett annonse' : 'Kom i gang'}
        </CreateListingCTA>
      </CreateListingInfo>
    </CreateListingCardWrapper>
  );
}
