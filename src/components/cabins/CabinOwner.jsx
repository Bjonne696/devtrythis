import { getPublicUrl } from "../../lib/storage";
import { OwnerInfo, OwnerPlaceholder, OwnerDetails } from "../../styles/cabins/cabinStyles";

export default function CabinOwner({ owner, cabinLocation }) {
  if (!owner) return null;

  const avatarSrc = owner.avatar_url ? getPublicUrl("avatars", owner.avatar_url) : null;

  return (
    <OwnerInfo>
      {avatarSrc ? (
        <img src={avatarSrc} alt="Eier" />
      ) : (
        <OwnerPlaceholder />
      )}
      <OwnerDetails>
        <p><strong>Eier:</strong> {owner.name} {owner.last_name}</p>
        <p><strong>Område:</strong> {cabinLocation || "Ikke spesifisert"}</p>
      </OwnerDetails>
    </OwnerInfo>
  );
}