import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ALLOWED_EXTENSIONS, ALLOWED_TYPES } from '@takwira/shared';
import { toast } from 'sonner';

export type StadiumImage = { id: string; url: string };

interface StadiumImagesManagerProps {
  stadiumId: number;
  images: StadiumImage[];
  principalImageId?: string;
  onImagesUpdated: (images: StadiumImage[], principalImageId?: string) => void;
  isOwner?: boolean;
}

export function StadiumImagesManager({
  stadiumId,
  images,
  principalImageId,
  onImagesUpdated,
  isOwner = true,
}: StadiumImagesManagerProps) {
  const { logout } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [settingPrincipal, setSettingPrincipal] = useState(false);

  const getFileExtension = (name: string) => {
    const parts = name.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
  };

  const handleUploadImages = async (files: FileList) => {
    if (!isOwner) return;

    const fileArray = Array.from(files) as File[];
    const canAddCount = Math.min(fileArray.length, 10 - images.length);

    if (canAddCount <= 0) {
      toast.error('Stadium already has 10 images (maximum limit)');
      return;
    }

    if (canAddCount < fileArray.length) {
      toast.warning(`Only ${canAddCount} image(s) can be added (max 10 total)`);
    }

    const validFiles = fileArray
      .slice(0, canAddCount)
      .filter((f) => {
        const ext = getFileExtension(f.name);
        const validExt = ALLOWED_EXTENSIONS.includes(ext);
        const validType = ALLOWED_TYPES.includes(f.type);
        return validExt || validType;
      });

    if (validFiles.length === 0) {
      toast.error('No valid image files selected');
      return;
    }

    if (validFiles.length < canAddCount) {
      toast.warning(`${validFiles.length} valid image(s) will be uploaded`);
    }

    setUploading(true);
    try {
      const formData = new FormData();
      validFiles.forEach((f) => formData.append('images', f, f.name));

      const token = localStorage.getItem('token');
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/stadiums/${stadiumId}/images`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (res.status === 401) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }

      if (!res.ok) {
        throw new Error('Failed to upload images');
      }

      const updated = await res.json();
      onImagesUpdated(updated.images, updated.principalImageId);
      toast.success(`${validFiles.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!isOwner) return;

    setDeleting(imageId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/stadiums/${stadiumId}/images/${imageId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 401) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }

      if (!res.ok) {
        throw new Error('Failed to delete image');
      }

      const updated = await res.json();
      onImagesUpdated(updated.images, updated.principalImageId);
      toast.success('Image deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const handleSetPrincipal = async (imageId: string) => {
    if (!isOwner) return;

    setSettingPrincipal(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/stadiums/${stadiumId}/images/${imageId}/principal`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 401) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }

      if (!res.ok) {
        throw new Error('Failed to set principal image');
      }

      const updated = await res.json();
      onImagesUpdated(updated.images, updated.principalImageId);
      toast.success('Principal image updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Update failed');
    } finally {
      setSettingPrincipal(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-300">
          Stadium Images ({images.length}/10)
        </h4>
        <div className="text-xs text-gray-500">
          {10 - images.length} slots available
        </div>
      </div>

      {isOwner && images.length < 10 && (
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleUploadImages(e.target.files)}
            disabled={uploading}
            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="px-4 py-3 rounded-xl border-2 border-dashed border-emerald-700/40 bg-emerald-900/10 hover:border-emerald-600/60 hover:bg-emerald-900/20 transition-all cursor-pointer">
            <div className="text-center">
              {uploading ? (
                <>
                  <div className="inline-block w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-sm text-emerald-400">Uploading images...</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-300">
                    📸 Click or drag to add up to {10 - images.length} image(s)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, WebP (max 5MB each)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((image) => {
            const isPrincipal = principalImageId === image.id;
            return (
              <div
                key={image.id}
                className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                  isPrincipal
                    ? 'border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
               
                <img
                  src={image.url.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${image.url}` : image.url}
                  alt="Stadium"
                  className="w-full h-32 object-cover"
                />

                {isPrincipal && (
                  <div className="absolute top-1 left-1 bg-emerald-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    ★ Principal
                  </div>
                )}

                {isOwner && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {!isPrincipal && (
                      <button
                        onClick={() => handleSetPrincipal(image.id)}
                        disabled={settingPrincipal}
                        className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
                      >
                        ★ Set as Main
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      disabled={deleting === image.id}
                      className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
                    >
                      🗑 Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          No images yet. Upload images to get started.
        </div>
      )}

      {images.length >= 10 && (
        <div className="p-3 rounded-lg bg-amber-900/20 border border-amber-700/40 text-amber-400 text-xs">
          ⚠️ Maximum 10 images reached. Delete an image to upload more.
        </div>
      )}
    </div>
  );
}
