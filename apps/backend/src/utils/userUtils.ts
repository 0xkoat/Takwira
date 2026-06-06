import { User, UserWithPassword } from "@takwira/shared";

export const sanitizeUser = (user: UserWithPassword): User => {
    const { hashedPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
