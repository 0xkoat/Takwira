import express, { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { UserData } from "@takwira/shared";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    console.error("WARNING: JWT_SECRET environment variable is not defined!");
}

const USERS_FILE = path.resolve(__dirname, "../data/users.json");
const logInRouter: Router = express.Router();

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

logInRouter.post('/', (req: Request, res: Response): void => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }
    
    const isPasswordValid = bcrypt.compareSync(password, user.hashedPassword);
    if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }

    const secret = jwtSecret || 'fallback_secret';
    const token = jwt.sign(
        { userId: user.id, role: user.role }, 
        secret, 
        { expiresIn: '15min' } 
    );

    const { hashedPassword: _, ...userWithoutPassword } = user;
    res.status(200).json({ 
        token,
        user: userWithoutPassword
    });
});

export default logInRouter;