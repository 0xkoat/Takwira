import { useState, useRef } from 'react';

interface ProfilePhotoProps {
  imageUrl: string;
  onPhotoUpdate: (newImageUrl: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export function ProfilePhoto({ imageUrl, onPhotoUpdate }: ProfilePhotoProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- File selection + validation ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError(null);
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setPhotoError('Photo must be smaller than 5 MB.');
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setPhotoError('Only JPEG, PNG, GIF, and WebP images are allowed.');
      return;
    }

    setPhotoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!photoFile) {
      setPhotoError('No photo selected.');
      return;
    }

    // For MVP
    const newImageUrl = URL.createObjectURL(photoFile);
    onPhotoUpdate(newImageUrl);
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCancel = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <img
        src={photoPreview ?? imageUrl}
        alt="Profile"
        style={{
          width: 130,
          height: 130,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '3px solid #ccc',
        }}
      />

      <div style={{ marginTop: '0.5rem' }}>
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          Change Photo
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {photoFile && (
        <div style={{ marginTop: '0.5rem' }}>
          <button onClick={handleSave}>Save Photo</button>
          <button onClick={handleCancel} style={{ marginLeft: '0.5rem' }}>
            Cancel
          </button>
        </div>
      )}
      {photoError && (
        <p style={{ color: 'red', marginTop: '0.25rem' }}>{photoError}</p>
      )}
    </div>
  );
}
