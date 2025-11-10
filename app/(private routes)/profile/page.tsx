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
        <h2>Name: {user.username}</h2>
        <h2>Email: {user.email}</h2>
        <p>
          Some description: Lorem ipsum dolor sit amet consectetur adipisicing
          elit...
        </p>
      </div>
    </section>
  );
}

export default Profile;
