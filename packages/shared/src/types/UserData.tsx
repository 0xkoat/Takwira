export enum UserRole {
  StadiumOwner = 'stadium_owner',
  NormalUser = 'normal_user',
}

export interface UserData {
  username: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  imageUrl: string;
}
