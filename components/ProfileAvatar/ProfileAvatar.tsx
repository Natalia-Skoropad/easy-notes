'use client';

import css from './ProfileAvatar.module.css';

//===========================================================================

interface ProfileAvatarProps {
  initials: string;
  size?: 'md' | 'lg';
}

//===========================================================================

function ProfileAvatar({ initials, size = 'lg' }: ProfileAvatarProps) {
  const wrapClass =
    size === 'md' ? `${css.wrap} ${css.wrapMd}` : `${css.wrap} ${css.wrapLg}`;

  return (
    <div className={wrapClass} aria-hidden="true">
      <div className={css.inner}>{initials}</div>
    </div>
  );
}

export default ProfileAvatar;
