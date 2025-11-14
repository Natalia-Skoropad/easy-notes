import { LinkButton } from '@/app/components';
import { getMe } from '@/lib/api/serverApi';

import css from './profile.module.css';

//===========================================================================

async function Profile() {
  const user = await getMe();

  const initials =
    user.username
      ?.split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  return (
    <section className={css.section}>
      <div className={css.card}>
        <div className={css.topRow}>
          {/* Avatar */}
          <div className={css.avatarWrap}>
            <div className={css.avatarStub}>{initials}</div>
          </div>
          {/* Heading */}
          <div>
            <div className={css.badge}>Account overview</div>
            <h1 className={css.title}>{user.username || 'Your profile'}</h1>
            <p className={css.sub}>
              Personal data, account details, and secure access to your Easy
              Notes workspace.
            </p>
          </div>

          {/* Actions */}
          <div className={css.actions}>
            <LinkButton
              href="/profile/edit"
              text="Edit profile"
              variant="normal"
            />
          </div>
        </div>

        {/* Info */}
        <div className={css.infoGrid}>
          <div className={css.infoBlock}>
            <span className={css.label}>Email</span>
            <span className={css.value}>{user.email}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
