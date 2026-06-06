import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserWithPassword } from "@takwira/shared";

const SALT_ROUNDS = 10;

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("FATAL ERROR: JWT_SECRET is not defined.");
    }
    return secret;
};

export const signToken = (user: Pick<UserWithPassword, 'id' | 'role'>): string => {
    return jwt.sign({ userId: user.id, role: user.role }, getJwtSecret(), { expiresIn: '15min' });
};

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};
