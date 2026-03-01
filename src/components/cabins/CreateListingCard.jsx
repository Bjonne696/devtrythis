import React from 'react';
import {
  CreateListingCardWrapper,
  CreateListingIconSection,
  CreateListingIcon,
  CreateListingInfo,
  CreateListingTitle,
  CreateListingDescription,
  CreateListingCTA
} from '../../styles/cabins/createListingCardStyles';

function CreateListingCard({ isLoggedIn = false }) {
  const handleClick = () => {
    if (isLoggedIn) {
      window.location.href = '/ny-hytte';
    } else {
      sessionStorage.setItem('redirectAfterAuth', '/ny-hytte');
      window.location.href = '/register';
    }
  };

  return (
    <CreateListingCardWrapper onClick={handleClick}>
      <CreateListingIconSection>
        <CreateListingIcon>🏠</CreateListingIcon>
      </CreateListingIconSection>
      <CreateListingInfo>
        <CreateListingTitle>Leie ut din feriebolig?</CreateListingTitle>
        <CreateListingDescription>
          Del din feriebolig med andre og tjen ekstra inntekt på dager du ikke bruker den.
        </CreateListingDescription>
        <CreateListingCTA>
          {isLoggedIn ? 'Opprett annonse' : 'Kom i gang'}
        </CreateListingCTA>
      </CreateListingInfo>
    </CreateListingCardWrapper>
  );
}

export default CreateListingCard;
