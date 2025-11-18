import type { Metadata } from 'next';
import EditProfileClient from './EditProfileClient';

//===========================================================================

const SITE_URL = 'https://easy-notes-ten.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Edit profile | EasyNotes',
  description:
    'Change your EasyNotes display name and review your profile settings.',

  openGraph: {
    title: 'Edit profile | EasyNotes',
    description:
      'Change your EasyNotes display name and review your profile settings.',
    url: `${SITE_URL}/profile/edit`,
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
    title: 'Edit profile | EasyNotes',
    description:
      'Change your EasyNotes display name and review your profile settings.',
    images: ['/note-og-meta.jpg'],
  },
};

//===========================================================================

function EditProfilePage() {
  return <EditProfileClient />;
}

export default EditProfilePage;
