import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import { getPublicUrl } from '../../lib/storage';
import {
  AvatarContainer,
  AvatarImage,
  AvatarPlaceholder,
  NotificationBadge
} from '../../styles/layout/navigationStyles';

export default function UserMenu() {
  const { user, profile } = useAuth();
  const { count } = useNotifications(user?.id);
  const navigate = useNavigate();

  if (!user || !profile) return null;

  const avatarUrl = profile.avatar_url 
    ? getPublicUrl('avatars', profile.avatar_url)
    : null;

  const getInitials = () => {
    const firstName = profile.name || '';
    const lastName = profile.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  const handleClick = () => {
    navigate('/min-profil');
  };

  return (
    <AvatarContainer onClick={handleClick}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={`${profile.name} ${profile.last_name}`} />
      ) : (
        <AvatarPlaceholder>{getInitials()}</AvatarPlaceholder>
      )}
      {count > 0 && (
        <NotificationBadge>{count > 9 ? '9+' : count}</NotificationBadge>
      )}
    </AvatarContainer>
  );
}
