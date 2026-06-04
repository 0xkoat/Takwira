import express, { Request, Response, Router } from "express";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import { UserData } from "@takwira/shared";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
    throw new Error("FATAL ERROR: JWT_SECRET is not defined. The application cannot start safely.");
}

const USERS_FILE = path.resolve(__dirname, "../data/users.json");
const logInRouter: Router = express.Router();

const getUsers = async (): Promise<UserData[]> => {
    try {
        const data = await fs.readFile(USERS_FILE, "utf-8");
        return JSON.parse(data);
    } catch (e) {
        // If file doesn't exist or is invalid JSON
        return [];
    }
};

logInRouter.post('/', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
    }

    const users = await getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role }, 
        process.env.JWT_SECRET as string, 
        { expiresIn: '15min' } 
    );

    const { hashedPassword: _, ...userWithoutPassword } = user;
    res.status(200).json({ 
        token,
        user: userWithoutPassword
    });
});

export default logInRouter;