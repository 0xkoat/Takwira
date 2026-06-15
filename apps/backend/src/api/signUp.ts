import express, { Request, Response, Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma";
import { UserRole } from "@takwira/shared";
import { normalizePhoneNumber } from "../utils/phoneUtils";
import { hashPassword } from "../utils/authUtils";
import { sanitizeUser } from "../utils/userUtils";
import { validate } from "../middlewares/validateMiddleware";

const signUpRouter: Router = express.Router();
const DEFAULT_USER_IMAGE = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

const signUpSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username must be at least 3 characters").max(30).regex(/^[A-Za-z0-9_-]+$/, "Invalid username format"),
        email: z.string().email("Invalid email address"),
        password: z.string()
            .min(8, "Password must be at least 8 characters long.")
            .regex(/(?=.*[a-z])/, "Password must contain a lowercase letter.")
            .regex(/(?=.*[A-Z])/, "Password must contain an uppercase letter.")
            .regex(/(?=.*\d)/, "Password must contain a number.")
            .regex(/(?=.*\W)/, "Password must contain a symbol."),
        confirmPassword: z.string(),
        phoneNumber: z.any(),
        role: z.nativeEnum(UserRole, {
            errorMap: () => ({ message: "Invalid role selected" })
        }),
        imageUrl: z.string().url().optional().or(z.literal("")),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }),
});

signUpRouter.post('/', validate(signUpSchema), async (req: Request, res: Response): Promise<void> => { 
    const { username, email, password, phoneNumber, role, imageUrl: providedImageUrl } = req.body;

    const userExists = await prisma.user.findUnique({
        where: { email }
    });
    
    if (userExists) {
        res.status(400).json({ error: "A user with this email already exists." });
        return;
    }

    const imageUrl = providedImageUrl || DEFAULT_USER_IMAGE;
    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            phoneNumber: normalizePhoneNumber(phoneNumber),
            role,
            imageUrl,
            hashedPassword: hashedPassword,
        }
    });

    res.status(201).json(sanitizeUser(newUser as any));
})

export default signUpRouter;