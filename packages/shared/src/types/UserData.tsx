export enum UserRole {
  StadiumOwner = 'stadium_owner',
  NormalUser = 'normal_user',
}

export interface UserData {
  id: Number;
  username: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  imageUrl: string;
}
