import { LinkButton } from '@/app/components';
import { getServerMe } from '@/lib/api/serverApi';

import css from './profile.module.css';

//===========================================================================

async function Profile() {
  const user = await getServerMe();

  return (
    <section className={css.section}>
      <div>
        <h1>My Profile</h1>
        <LinkButton href="/profile/edit" text="Edit profile" variant="cancel" />
      </div>

      <div>
        <h2>Name: {user.userName}</h2>
        <h3>Email: {user.email}</h3>
      </div>
    </section>
  );
}

export default Profile;
