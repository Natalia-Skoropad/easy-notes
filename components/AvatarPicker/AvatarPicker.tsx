'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/app/components';

import css from './AvatarPicker.module.css';

//===========================================================================

interface AvatarPickerProps {
  onChangePhoto: (file: File | null) => void;
  profilePhotoUrl?: string;
}

//===========================================================================

function AvatarPicker({ profilePhotoUrl, onChangePhoto }: AvatarPickerProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(profilePhotoUrl ?? '');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!profilePhotoUrl) return;

    const id = setTimeout(() => {
      setPreviewUrl(prev =>
        prev === profilePhotoUrl ? prev : profilePhotoUrl
      );
    }, 0);

    return () => clearTimeout(id);
  }, [profilePhotoUrl]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');

    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Only images');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Max file size 5MB');
        return;
      }

      onChangePhoto(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onChangePhoto(null);
    setPreviewUrl('');
    setError('');
  };

  return (
    <div className={css.picker}>
      <div className={css.avatarBox}>
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Avatar preview"
            width={72}
            height={72}
            className={css.avatar}
          />
        ) : (
          <div className={css.stub}>📷</div>
        )}
      </div>

      <div className={css.controls}>
        <label className={css.fileLabel}>
          <span className={css.icon}>📷</span>
          <span>Choose photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={css.input}
          />
        </label>

        {previewUrl && (
          <Button
            type="button"
            variant="delete"
            text="Remove"
            className={css.remove}
            onClick={handleRemove}
          />
        )}
      </div>

      {error && <p className={css.error}>{error}</p>}
    </div>
  );
}

export default AvatarPicker;
