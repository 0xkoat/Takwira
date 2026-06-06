import { UserData , UserWithPassword } from "@takwira/shared";

export const sanitizeUser = (user: UserWithPassword): UserData => {
    const { hashedPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
