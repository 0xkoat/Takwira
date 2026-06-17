import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Stadium } from '@takwira/shared';
import { useForm } from 'react-hook-form';
import { StadiumImagesManager, StadiumImage } from '../stadiums/StadiumImagesManager';

type EditForm = {
  name: string;
  address: string;
  capacity: number;
  pricePerHour: number;
  description: string;
};

export function OwnerStadiums() {
  const { user } = useAuth();
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Stadium | null>(null);
  const [editingImages, setEditingImages] = useState<StadiumImage[]>([]);
  const [editingPrincipalImageId, setEditingPrincipalImageId] = useState<string>();
  const [deleting, setDeleting] = useState<number | null>(null);

  const { register, handleSubmit, reset } = useForm<EditForm>();

  useEffect(() => {
    if (!user) return;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stadiums?ownerId=${user.id}`)
      .then((r) => r.json())
      .then((data) => { setStadiums(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  const openEdit = (stadium: Stadium) => {
    setEditing(stadium);
    setEditingImages(
      (stadium as any).images?.map((img: any) => ({
        id: img.id,
        url: img.url,
      })) || []
    );
    setEditingPrincipalImageId((stadium as any).principalImageId);
    reset({
      name: stadium.name,
      address: stadium.city,
      capacity: stadium.placesNum,
      pricePerHour: stadium.price,
      description: stadium.description ?? '',
    });
  };

  const saveEdit = async (data: EditForm) => {
    if (!editing) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stadiums/${editing.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) return;
    const updated: Stadium = await res.json();
    setStadiums((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEditing(null);
  };

  const confirmDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stadiums/${id}`, { 
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) return;
    setStadiums((prev) => prev.filter((s) => s.id !== id));
    setDeleting(null);
  };

  const handleImagesUpdated = (images: StadiumImage[], principalImageId?: string) => {
    setEditingImages(images);
    setEditingPrincipalImageId(principalImageId);
    if (editing) {
      setStadiums((prev) =>
        prev.map((s) =>
          s.id === editing.id
            ? { ...s, images, principalImageId } as any
            : s
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm mt-4">
        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        Loading your stadiums…
      </div>
    );
  }

  if (stadiums.length === 0) {
    return (
      <p className="text-gray-500 text-sm mt-4 italic">
        You haven't posted any stadiums yet.
      </p>
    );
  }

  return (
    <>
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-emerald-400 mb-4">My Stadiums</h3>
        <div className="space-y-4">
          {stadiums.map((stadium) => (
            <div
              key={stadium.id}
              className="bg-gray-800 border border-emerald-800/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all hover:border-emerald-700/40"
            >
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{stadium.name}</p>
                <p className="text-gray-400 text-sm">{stadium.city} · {stadium.price} TND/hour · {stadium.placesNum} places</p>
                {stadium.description && (
                  <p className="text-gray-500 text-xs mt-1 line-clamp-1">{stadium.description}</p>
                )}
              </div>
             
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEdit(stadium)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700/20 border border-emerald-700/40 text-emerald-400 text-sm hover:bg-emerald-700/40 transition-all"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setDeleting(stadium.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-900/20 border border-red-700/40 text-red-400 text-sm hover:bg-red-800/40 transition-all"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-emerald-800/30 rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-emerald-400 mb-5">Edit Stadium</h3>
            <form onSubmit={handleSubmit(saveEdit)} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Name</label>
                <input {...register('name')} className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">City / Address</label>
                <input {...register('address')} className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Capacity</label>
                  <input type="number" {...register('capacity', { valueAsNumber: true })} className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Price / hour (TND)</label>
                  <input type="number" step="0.01" {...register('pricePerHour', { valueAsNumber: true })} className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <textarea {...register('description')} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm resize-none" />
              </div>

              <div className="border-t border-gray-700 pt-4 mt-4">
                <StadiumImagesManager
                  stadiumId={editing.id}
                  images={editingImages}
                  principalImageId={editingPrincipalImageId}
                  onImagesUpdated={handleImagesUpdated}
                  isOwner={true}
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold transition-all">
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleting !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-red-800/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-lg font-semibold text-white mb-2">Delete Stadium?</h3>
            <p className="text-gray-400 text-sm mb-5">This action cannot be undone. The stadium will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => confirmDelete(deleting)}
                className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-semibold transition-all"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleting(null)}
                className="flex-1 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
