import express, { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { UserData, UserRole } from "@takwira/shared";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";

const USERS_FILE = path.resolve(__dirname, "../data/users.json");
const profileRouter: Router = express.Router();

const getUsers = (): UserData[] => {
    if (fs.existsSync(USERS_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
        } catch (e) {
            console.error("Error reading users file", e);
        }
    }
    return [];
};

const persistUsers = (users: UserData[]) => { 
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

// GET /api/profile/me
profileRouter.get('/me', authMiddleware, (req: AuthRequest, res: Response): void => {
    const userId = req.user?.userId;
    const users = getUsers();
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    
    // Return user without password
    const { hashedPassword: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
});

// PUT /api/profile
profileRouter.put('/', authMiddleware, (req: AuthRequest, res: Response): void => {
    const userId = req.user?.userId;
    const { username, email, password, imageUrl, role, phoneNumber } = req.body;
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    // Check if email is unique (only if they are trying to change it)
    if (email && email !== users[userIndex].email) {
        const emailExists = users.some(u => u.email === email);
        if (emailExists) {
            res.status(400).json({ error: "Email is already in use by another account." });
            return;
        }
    }

    const updatedUser = { ...users[userIndex] };

    // Update basic fields
    if (username) updatedUser.username = username;
    if (email) updatedUser.email = email;
    if (imageUrl) updatedUser.imageUrl = imageUrl;
    if (phoneNumber) updatedUser.phoneNumber = phoneNumber;
    
    // Update role securely
    if (role === 'stadium_owner' || role === 'normal_user') {
        updatedUser.role = role as UserRole;
    }

    // Hash and update password if provided
    if (password) {
        const saltRounds = 10;
        updatedUser.hashedPassword = bcrypt.hashSync(password, saltRounds);
    }

    users[userIndex] = updatedUser;
    persistUsers(users);

    // Return the updated user info without password
    const { hashedPassword: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json(userWithoutPassword);
});

export default profileRouter;
