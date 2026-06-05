import express, { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { UserRole, UserWithPassword } from "@takwira/shared";

const USERS_FILE = path.resolve(__dirname, "../data/users.json");
const signUpRouter: Router = express.Router();

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

const DEFAULT_USER_IMAGE = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

const persistUsers = (users: UserWithPassword[]) => { 
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

const saltRounds = 10;

signUpRouter.post('/', async (req: Request, res: Response): Promise<void> => { 
    const { username, email, password, confirmPassword, phoneNumber, role, imageUrl: providedImageUrl } = req.body;
    
    if (password !== confirmPassword) {
        res.status(400).json({ error: "Passwords do not match." });
        return;
    }

    const users = getUsers();

    const userExists = users.find(u => u.email === email);
    if (userExists) {
        res.status(400).json({ error: "A user with this email already exists." });
        return;
    }

    const lastId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
    const nextId = lastId + 1;

    const imageUrl = providedImageUrl || DEFAULT_USER_IMAGE;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let cleanedPhoneNumber = String(phoneNumber).replace(/\D/g, '');
    if (cleanedPhoneNumber.startsWith('216') && cleanedPhoneNumber.length > 8) {
        cleanedPhoneNumber = cleanedPhoneNumber.substring(3);
    }
    const parsedPhoneNumber = parseInt(cleanedPhoneNumber) || 0;

    const newUser: UserWithPassword = {
        id: nextId,
        username,
        email,
        phoneNumber: parsedPhoneNumber,
        role: role as UserRole,
        imageUrl,
        hashedPassword: hashedPassword,
    }
    users.push(newUser);
    persistUsers(users);

    const { hashedPassword: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json(userWithoutPassword);
})

export default signUpRouter;