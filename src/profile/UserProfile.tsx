import { useAuth } from '../context/AuthContext';
import { ProfilePhoto } from './ProfilePhoto';
import { EditCredentials } from './EditCredentials';
import { UserData } from '../types/UserData';

export function UserProfile() {
  const { user, updateUser } = useAuth();

  if (!user) {
    return null;
  }

  const handleCredentialsUpdate = (updatedData: Omit<UserData, 'imageUrl'>) => {
    updateUser({
      ...user,
      ...updatedData,
    });
  };

  const handlePhotoUpdate = (newImageUrl: string) => {
    updateUser({
      ...user,
      imageUrl: newImageUrl,
    });
  };

  return (
    <div className="bg-gray-900 border border-emerald-800/30 rounded-2xl p-8 shadow-xl shadow-black/20">
      <h2 className="text-2xl font-semibold text-center text-emerald-400 mb-8">
        My Profile
      </h2>

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
    </div>
  );
}