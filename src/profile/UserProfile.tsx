import { useState } from 'react';
import { ProfilePhoto } from './ProfilePhoto';
import { EditCredentials } from './EditCredentials';
import { UserData, UserRole } from '../types/UserData';


const INITIAL_USER: UserData = {
  username: 'koat',
  email: 'koat@example.com',
  phoneNumber: '12345678',
  role: UserRole.NormalUser,
  imageUrl: 'https://via.placeholder.com/150',
};

export function UserProfile() {
  const [user, setUser] = useState<UserData>(INITIAL_USER);

  const handleCredentialsUpdate = (updatedData: Omit<UserData, 'imageUrl'>) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const handlePhotoUpdate = (newImageUrl: string) => {
    setUser((prev) => ({ ...prev, imageUrl: newImageUrl }));
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
