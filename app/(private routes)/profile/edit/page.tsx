'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AvatarPicker, Button } from '@/app/components';
import { updateMe, getMe, uploadImage } from '@/lib/api/clientApi';

//===========================================================================

function EditProfile() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    getMe().then(user => {
      setUserName(user.userName ?? '');
      setPhotoUrl(user.photoUrl ?? '');
    });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleSaveUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const newPhotoUrl = imageFile ? await uploadImage(imageFile) : '';
      await updateMe({ userName, photoUrl: newPhotoUrl });
    } catch (error) {
      console.error('Oops, some error:', error);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <div>
      <h1>Edit profile</h1>
      <AvatarPicker profilePhotoUrl={photoUrl} onChangePhoto={setImageFile} />

      <form onSubmit={handleSaveUser}>
        <label>
          Username
          <input value={userName} onChange={handleChange} required />
        </label>

        <div>
          <Button type="submit" text="Save" />
          <Button
            type="button"
            variant="cancel"
            text="Cancel"
            onClick={handleCancel}
          />
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
