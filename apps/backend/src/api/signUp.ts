import express, { Request, Response, Router } from "express";
import { UserRole, UserWithPassword } from "@takwira/shared";
import { getUsers, persistUsers } from "../utils/userStore";
import { normalizePhoneNumber } from "../utils/phoneUtils";
import { hashPassword } from "../utils/authUtils";
import { sanitizeUser } from "../utils/userUtils";

const signUpRouter: Router = express.Router();
const DEFAULT_USER_IMAGE = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

signUpRouter.post('/', async (req: Request, res: Response): Promise<void> => { 
    const { username, email, password, confirmPassword, phoneNumber, role, imageUrl: providedImageUrl } = req.body;
    
    if (password !== confirmPassword) {
        res.status(400).json({ error: "Passwords do not match." });
        return;
    }

    const users = await getUsers();

    const userExists = users.find(u => u.email === email);
    if (userExists) {
        res.status(400).json({ error: "A user with this email already exists." });
        return;
    }

    const lastId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
    const nextId = lastId + 1;

    const imageUrl = providedImageUrl || DEFAULT_USER_IMAGE;
    const hashedPassword = await hashPassword(password);

    const newUser: UserWithPassword = {
        id: nextId,
        username,
        email,
        phoneNumber: normalizePhoneNumber(phoneNumber),
        role: role as UserRole,
        imageUrl,
        hashedPassword: hashedPassword,
    }
    users.push(newUser);
    await persistUsers(users);

    res.status(201).json(sanitizeUser(newUser));
})

export default signUpRouter;