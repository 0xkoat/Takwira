export enum UserRole {
  StadiumOwner = 'stadium_owner',
  NormalUser = 'normal_user',
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  phoneNumber: number;
  role: UserRole;
  imageUrl: string;
}

export interface UserWithPassword extends UserData {
  hashedPassword: string;
}
