import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserRole } from '@takwira/shared';

const schema = z.object({
  username: z
    .string()
    .min(3, 'Username must be 3–30 characters.')
    .max(30)
    .regex(/^[A-Za-z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, underscores.'),
  email: z.string().email('Please enter a valid email address.'),
  phoneNumber: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, 'Please enter a valid phone number.'),
  role: z.nativeEnum(UserRole),
});

type ProfileData = z.infer<typeof schema>;

interface Profile extends ProfileData {
  onSave: (data: ProfileData) => Promise<void>;
}

type FormData = ProfileData;

export function EditCredentials({
  username,
  email,
  phoneNumber,
  role,
  onSave,
}: Profile) {
  const [isEditing, setIsEditing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username,
      email,
      phoneNumber,
      role,
    },
  });

  const handleStartEdit = () => {
    reset({ username, email, phoneNumber, role });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({ username, email, phoneNumber, role });
  };

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await onSave(data);
      setIsEditing(false);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={rhfHandleSubmit(onSubmit)} className="space-y-5 animate-fadeIn">
        {serverError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium animate-pulse">
            {serverError}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Username
          </label>
          <input
            type="text"
            {...register('username')}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          {errors.username && (
            <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            {...register('phoneNumber')}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          {errors.phoneNumber && (
            <p className="text-red-400 text-sm mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>
        <div>
          <fieldset>
            <legend className="text-sm font-medium text-gray-300 mb-2">
              Role
            </legend>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={UserRole.StadiumOwner}
                  {...register('role')}
                  className="accent-emerald-500 w-4 h-4"
                />
                <span className="text-gray-300">Stadium Owner</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={UserRole.NormalUser}
                  {...register('role')}
                  className="accent-emerald-500 w-4 h-4"
                />
                <span className="text-gray-300">Normal User</span>
              </label>
            </div>
          </fieldset>
        </div>
        {errors.role && <p className="text-red-400 text-sm">{errors.role.message}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold transition-all"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Username</span>
          <span className="text-white font-medium">{username}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Email</span>
          <span className="text-white font-medium">{email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Phone</span>
          <span className="text-white font-medium">{phoneNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Role</span>
          <span className="text-white font-medium">
            {role === UserRole.StadiumOwner ? 'Stadium Owner' : 'Normal User'}
          </span>
        </div>
      </div>
      <button
        onClick={handleStartEdit}
        className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold transition-all"
      >
        Edit Credentials
      </button>
    </div>
  );
}
