import express, { Response, Router } from "express";
import { z } from "zod";
import { UserRole } from "@takwira/shared";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validateMiddleware";
import { getUsers, persistUsers } from "../utils/userStore";
import { normalizePhoneNumber } from "../utils/phoneUtils";
import { hashPassword, signToken } from "../utils/authUtils";
import { sanitizeUser } from "../utils/userUtils";

const profileRouter: Router = express.Router();

const updateProfileSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username must be at least 3 characters").max(30).regex(/^[A-Za-z0-9_-]+$/, "Invalid username format").optional(),
        email: z.string().email("Invalid email address").optional(),
        password: z.string().min(6, "Password must be at least 6 characters").optional(),
        imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
        role: z.nativeEnum(UserRole).optional(),
        phoneNumber: z.any().optional(),
    }),
});

profileRouter.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const users = await getUsers();
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    
    res.status(200).json(sanitizeUser(user));
});

profileRouter.put('/', authMiddleware, validate(updateProfileSchema), async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const { username, email, password, imageUrl, role, phoneNumber } = req.body;
    
    const users = await getUsers();
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
    if (phoneNumber) updatedUser.phoneNumber = normalizePhoneNumber(phoneNumber);
    
    if (role === 'stadium_owner' || role === 'normal_user') {
        updatedUser.role = role as UserRole;
    }

    if (password) {
        updatedUser.hashedPassword = await hashPassword(password);
    }

    users[userIndex] = updatedUser;
    await persistUsers(users);

    const token = signToken(updatedUser);

    res.status(200).json({ token, user: sanitizeUser(updatedUser) });
});

export default profileRouter;
