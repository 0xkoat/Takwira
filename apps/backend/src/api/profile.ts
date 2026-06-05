import express, { Response, Router } from "express";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { UserRole, UserWithPassword } from "@takwira/shared";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
    throw new Error("FATAL ERROR: JWT_SECRET is not defined.");
}

const USERS_FILE = path.resolve(__dirname, "../data/users.json");
const profileRouter: Router = express.Router();

const getUsers = (): UserWithPassword[] => {
    if (fs.existsSync(USERS_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
        } catch (e) {
            console.error("Error reading users file", e);
        }
    }
    return [];
};

const persistUsers = (users: UserWithPassword[]) => { 
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

profileRouter.get('/me', authMiddleware, (req: AuthRequest, res: Response): void => {
    const userId = req.user?.userId;
    const users = getUsers();
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    
    const { hashedPassword: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
});

profileRouter.put('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const { username, email, password, imageUrl, role, phoneNumber } = req.body;
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    if (email && email !== users[userIndex].email) {
        const emailExists = users.some(u => u.email === email);
        if (emailExists) {
            res.status(400).json({ error: "Email is already in use by another account." });
            return;
        }
    }

    const updatedUser = { ...users[userIndex] };

    if (username) updatedUser.username = username;
    if (email) updatedUser.email = email;
    if (imageUrl) updatedUser.imageUrl = imageUrl;
    if (phoneNumber) {
        let cleanedPhoneNumber = String(phoneNumber).replace(/\D/g, '');
        if (cleanedPhoneNumber.startsWith('216') && cleanedPhoneNumber.length > 8) {
            cleanedPhoneNumber = cleanedPhoneNumber.substring(3);
        }
        updatedUser.phoneNumber = parseInt(cleanedPhoneNumber) || 0;
    }
    
    if (role === 'stadium_owner' || role === 'normal_user') {
        updatedUser.role = role as UserRole;
    }

    if (password) {
        const saltRounds = 10;
        updatedUser.hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    users[userIndex] = updatedUser;
    persistUsers(users);

    const token = jwt.sign(
        { userId: updatedUser.id, role: updatedUser.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '15min' }
    );

    const { hashedPassword: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json({
        token,
        user: userWithoutPassword
    });
});

export default profileRouter;
