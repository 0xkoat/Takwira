import { useState, useRef } from 'react';

interface ProfilePhotoProps {
  imageUrl: string;
  onPhotoUpdate: (newImageUrl: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export function ProfilePhoto({ imageUrl, onPhotoUpdate }: ProfilePhotoProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError(null);
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setPhotoError('Photo must be smaller than 5 MB.');
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setPhotoError('Only JPEG, PNG, GIF, WebP allowed.');
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!photoFile) {
      setPhotoError('No photo selected.');
      return;
    }
    const newImageUrl = URL.createObjectURL(photoFile);
    onPhotoUpdate(newImageUrl);
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col items-center mb-10">
      <div className="relative group">
        <img
          src={photoPreview ?? imageUrl}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-emerald-800 shadow-lg shadow-emerald-900/30
                     transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-semibold">Change</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="mt-4 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
      >
        Choose Photo
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {photoFile && (
        <div className="mt-4 flex gap-3 animate-fadeIn">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium transition-all"
          >
            Save Photo
          </button>
          <button
            onClick={() => {
              setPhotoFile(null);
              setPhotoPreview(null);
              setPhotoError(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-all"
          >
            Cancel
          </button>
        </div>
      )}
      {photoError && <p className="mt-2 text-red-400 text-sm">{photoError}</p>}
    </div>
  );
}
