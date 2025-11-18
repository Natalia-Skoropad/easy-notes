import type { Metadata } from 'next';

import { LinkButton, Breadcrumbs, ProfileAvatar } from '@/app/components';
import { getMe } from '@/lib/api/serverApi';

import css from './profile.module.css';

//===========================================================================

const SITE_URL = 'https://easy-notes-ten.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Profile details | EasyNotes',
  description:
    'User profile: avatar, username and email. Manage your EasyNotes account.',

  openGraph: {
    title: 'Profile details | EasyNotes',
    description:
      'User profile: avatar, username and email. Manage your EasyNotes account.',
    url: `${SITE_URL}/profile`,
    siteName: 'EasyNotes',
    images: [
      {
        url: '/note-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'EasyNotes',
      },
    ],
    type: 'profile',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Profile details | EasyNotes',
    description:
      'User profile: avatar, username and email. Manage your EasyNotes account.',
    images: ['/note-og-meta.jpg'],
  },
};

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
      <div className={css.breadcrumbs}>
        <Breadcrumbs
          items={[
            {
              label: 'Home',
              href: '/',
            },
            { label: 'Profile details' },
          ]}
        />
      </div>

      <div className={css.card}>
        <div className={css.topRow}>
          {/* Avatar */}
          <div className={css.avatarArea}>
            <ProfileAvatar initials={initials} size="lg" />
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
              text="Profile Edit"
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
