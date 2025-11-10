'use client';

import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import css from './AvatarPicker.module.css';

//===========================================================================

interface AvatarPickerProps {
  onChangePhoto: (file: File | null) => void;
  profilePhotoUrl?: string;
}

//===========================================================================

function AvatarPicker({ profilePhotoUrl, onChangePhoto }: AvatarPickerProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const previewUrl = localPreview ?? profilePhotoUrl ?? '';

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');

    if (!file) return;

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
      const result = typeof reader.result === 'string' ? reader.result : '';
      setLocalPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChangePhoto(null);
    setLocalPreview(null);
  };

  return (
    <div>
      <div className={css.picker}>
        {previewUrl && (
          <Image
            src={previewUrl}
            alt="Preview"
            width={300}
            height={300}
            className={css.avatar}
          />
        )}

        <label
          className={previewUrl ? `${css.wrapper} ${css.reload}` : css.wrapper}
        >
          📷 Choose photo
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={css.input}
          />
        </label>

        {previewUrl && (
          <button type="button" className={css.remove} onClick={handleRemove}>
            ❌
          </button>
        )}
      </div>

      {error && <p className={css.error}>{error}</p>}
    </div>
  );
}

export default AvatarPicker;
