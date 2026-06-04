import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ALLOWED_EXTENSIONS, ALLOWED_TYPES } from '@takwira/shared';
import { useAuth } from '../context/AuthContext';

const getFileExtension = (name: string) => {
  const parts = name.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
};

const stadiumSchema = z.object({
  name: z.string().min(3, 'Stadium name must be at least 3 characters.'),
  address: z.string().min(5, 'Address is too short.'),
  capacity: z.preprocess((v) => (typeof v === 'string' ? Number(v) : v), z.number().int().positive('Capacity must be a positive integer')),
  pricePerHour: z.preprocess((v) => (typeof v === 'string' ? Number(v) : v), z.number().nonnegative('Price must be a non-negative number')),
  description: z.string().min(10, 'Provide a short description').max(1000).optional(),
  images: z.any()
    .refine((files) => files && (files as FileList).length > 0, 'At least one image is required.')
    .refine((files) => {
      const list = Array.from(files as FileList) as File[];
      return list.every((f) => {
        const ext = getFileExtension(f.name);
        const validExt = ALLOWED_EXTENSIONS.includes(ext);
        const validType = ALLOWED_TYPES.includes(f.type);
        return validExt || validType;
      });
    }, 'One or more images have invalid extension or MIME type.'),
});

type StadiumForm = z.infer<typeof stadiumSchema>;

export default function PostStadium() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<StadiumForm>({
    resolver: zodResolver(stadiumSchema),
    mode: 'onSubmit',
    defaultValues: { name: '', address: '', capacity: 0, pricePerHour: 0, description: '' as any },
  });

  const onSubmit = async (data: StadiumForm) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('address', data.address);
    formData.append('capacity', String(data.capacity));
    formData.append('pricePerHour', String(data.pricePerHour));
    if (data.description) formData.append('description', data.description);

    
    if (user) {
      formData.append('ownerId', String(user.id));
      formData.append('ownerName', user.username);
      formData.append('ownerNumber', user.phoneNumber);
    }

    const files = Array.from(data.images as FileList) as File[];
    files.forEach((f) => formData.append('images', f, f.name));

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to post a stadium');
    }
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stadiums`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    if (!res.ok) throw new Error('Failed to post stadium');
    navigate({ to: '/profile' });
  };

  return (
    <div className="bg-gray-900 border border-emerald-800/30 rounded-2xl p-8 shadow-xl shadow-black/20 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-emerald-400">Post your stadium</h2>
        <button
          onClick={() => navigate({ to: '/stadiums' })}
          type="button"
          className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-all"
        >
          Back to Stadiums
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Stadium name</label>
          <input {...register('name')} className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white" />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
          <input {...register('address')} className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white" />
          {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address.message as string}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Capacity</label>
            <input type="number" {...register('capacity', { valueAsNumber: true })} className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white" />
            {errors.capacity && <p className="text-red-400 text-sm mt-1">{(errors.capacity.message as string) ?? 'Invalid capacity'}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Price / hour</label>
            <input type="number" step="0.01" {...register('pricePerHour', { valueAsNumber: true })} className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white" />
            {errors.pricePerHour && <p className="text-red-400 text-sm mt-1">{(errors.pricePerHour.message as string) ?? 'Invalid price'}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Description (optional)</label>
          <textarea {...register('description')} rows={4} className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white" />
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Images</label>
          <input type="file" accept="image/*" multiple {...register('images')} className="w-full text-sm text-gray-300" />
          {errors.images && <p className="text-red-400 text-sm mt-1">{errors.images.message as string}</p>}
        </div>

        <button disabled={isSubmitting} type="submit" className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold">
          {isSubmitting ? 'Submitting…' : 'Post Stadium'}
        </button>
      </form>
    </div>
  );
}
