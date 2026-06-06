import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import { ProfilePhoto } from './ProfilePhoto';
import { EditCredentials } from './EditCredentials';
import { OwnerStadiums } from './OwnerStadiums';
import { UserData, UserRole } from '@takwira/shared';
import { toast } from 'sonner';

export function UserProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  if (!user) {
    return null;
  }

  const handleCredentialsUpdate = async (updatedData: Omit<UserData, 'imageUrl' | 'id'>) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to update credentials');
    }

    const newUserData = await res.json();
    updateUser(newUserData.user, newUserData.token);
    toast.success('Credentials updated successfully!');
  };

  const handlePhotoUpdate = async (newImageUrl: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imageUrl: newImageUrl })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update photo');
      }

      const newUserData = await res.json();
      updateUser(newUserData.user, newUserData.token);
      toast.success('Profile photo updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update photo');
      throw error;
    }
  };

  return (
    <div className="bg-gray-900 border border-emerald-800/30 rounded-2xl p-8 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-semibold text-emerald-400">
          My Profile
        </h2>
        <button
          onClick={() => navigate({ to: '/stadiums' })}
          className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition-all"
        >
          Back to Stadiums
        </button>
      </div>

      <ProfilePhoto
        imageUrl={user.imageUrl}
        onPhotoUpdate={handlePhotoUpdate}
      />

      <EditCredentials
        username={user.username}
        email={user.email}
        phoneNumber={user.phoneNumber}
        role={user.role}
        onSave={handleCredentialsUpdate}
      />

      {user.role === UserRole.StadiumOwner && <OwnerStadiums />}
    </div>
  );
}