'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AvatarPicker, Button } from '@/app/components';
import { getMe, updateMe, uploadImage } from '@/lib/api/clientApi';

//===========================================================================

function EditProfile() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    getMe().then(user => {
      setUsername(user.username || '');
      setAvatar(user.avatar || '');
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let avatarUrl = avatar;

      if (file) {
        avatarUrl = await uploadImage(file);
      }

      await updateMe({ username, avatar: avatarUrl });
      router.push('/profile');
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <section>
      <h1>Edit profile</h1>

      <AvatarPicker profilePhotoUrl={avatar} onChangePhoto={setFile} />

      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </label>

        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <Button type="submit" text="Save" />
          <Button
            type="button"
            variant="cancel"
            text="Cancel"
            onClick={handleCancel}
          />
        </div>
      </form>
    </section>
  );
}

export default EditProfile;
