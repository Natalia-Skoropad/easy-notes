'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AvatarPicker, Button } from '@/app/components';
import { updateMe, getMe, uploadImage } from '@/lib/api/clientApi';

import css from './profileEdit.module.css';

//===========================================================================

function EditProfile() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getMe()
      .then(user => {
        setUsername(user.username ?? '');
        setAvatar(user.avatar ?? '');
      })
      .catch(() => {});
  }, []);

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleChangePhoto = (file: File | null) => {
    setImageFile(file);
    if (!file) setAvatar('');
  };

  const handleSaveUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      let newAvatar = avatar;

      if (imageFile) {
        const uploaded = await uploadImage(imageFile);
        newAvatar = uploaded;
      }

      await updateMe({ username, avatar: newAvatar });
      router.push('/profile');
    } catch (error) {
      console.error('Oops, some error:', error);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <section className={css.section}>
      <div className={css.card}>
        <div className={css.headerRow}>
          <div className={css.titleBox}>
            <div className={css.badge}>Profile settings</div>
            <h1 className={css.title}>Edit profile</h1>
            <p className={css.subtitle}>
              Update your display name and avatar used across Easy Notes.
            </p>
          </div>

          <div className={css.avatarArea}>
            <AvatarPicker
              profilePhotoUrl={avatar}
              onChangePhoto={handleChangePhoto}
            />
          </div>
        </div>

        <form className={css.form} onSubmit={handleSaveUser}>
          <label className={css.label}>
            <span>Username*</span>
            <input
              className={css.input}
              value={username}
              onChange={handleChangeName}
              required
            />
          </label>

          <div className={css.actions}>
            <Button
              type="button"
              variant="cancel"
              text="Cancel"
              onClick={handleCancel}
            />
            <Button type="submit" text={isSaving ? 'Saving…' : 'Save'} />
          </div>
        </form>
      </div>
    </section>
  );
}

export default EditProfile;
