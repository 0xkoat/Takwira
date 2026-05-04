import { useState } from 'react';
import { ProfilePhoto } from './ProfilePhoto';
import { EditCredentials } from './EditCrendentials';

export interface UserData {
  username: string;
  email: string;
  phoneNumber: string;
  role: 'stadium_owner' | 'normal_user';
  imageUrl: string;
}

//dummu user
const INITIAL_USER: UserData = {
  username: 'koat',
  email: 'koat@example.com',
  phoneNumber: '12345678',
  role: 'normal_user',
  imageUrl: 'blabla',
};

export function UserProfile() {
  const [user, setUser] = useState<UserData>(INITIAL_USER);

  const handleCredentialsUpdate = (updatedData: Omit<UserData, 'imageUrl'>) => {
    setUser((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  const handlePhotoUpdate = (newImageUrl: string) => {
    setUser((prev) => ({ ...prev, imageUrl: newImageUrl }));
  };

  return (
    <div
      className="user-profile"
      style={{ maxWidth: 500, margin: '2rem auto', padding: '1rem' }}
    >
      <h2>My Profile</h2>

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
