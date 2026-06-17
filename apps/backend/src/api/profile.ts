import express, { Response, Router } from "express";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { prisma } from "../utils/prisma";
import { UserRole } from "@takwira/shared";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validateMiddleware";
import { normalizePhoneNumber } from "../utils/phoneUtils";
import { hashPassword, signToken } from "../utils/authUtils";
import { sanitizeUser } from "../utils/userUtils";
import { uploadProfilePhoto } from "../utils/profilePhoto";
import { deleteLocalStadiumImage } from "../utils/stadiumImagesUtils";

const DEFAULT_USER_IMAGE = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

const getLocalProfileFilePath = (imageUrl: string) => {
    const filename = path.basename(imageUrl);
    return path.resolve(__dirname, '../../uploads/profiles', filename);
};

const deleteLocalProfilePhoto = async (imageUrl?: string | null) => {
    if (!imageUrl || !imageUrl.startsWith('/uploads/profiles/')) {
        return;
    }

    const filePath = getLocalProfileFilePath(imageUrl);
    try {
        await fs.promises.unlink(filePath);
    } catch (error) {

    }
};

const profileRouter: Router = express.Router();

const updateProfileSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username must be at least 3 characters").max(30).regex(/^[A-Za-z0-9_-]+$/, "Invalid username format").optional(),
        email: z.string().email("Invalid email address").optional(),
        password: z.string()
            .min(8, "Password must be at least 8 characters long.")
            .regex(/(?=.*[a-z])/, "Password must contain a lowercase letter.")
            .regex(/(?=.*[A-Z])/, "Password must contain an uppercase letter.")
            .regex(/(?=.*\d)/, "Password must contain a number.")
            .regex(/(?=.*\W)/, "Password must contain a symbol.")
            .optional(),
        imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
        role: z.nativeEnum(UserRole).optional(),
        phoneNumber: z.any().optional(),
    }),
});

profileRouter.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    
    res.status(200).json(sanitizeUser(user as any ));
});

profileRouter.put('/', authMiddleware, validate(updateProfileSchema), async (req: AuthRequest, res: Response): Promise<void> => {
    
    const userId = req.user?.userId;
    const { username, email, password, imageUrl, role, phoneNumber } = req.body;
    
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    const updateData: any = {};

    if (username) updateData.username = username;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (phoneNumber) updateData.phoneNumber = normalizePhoneNumber(phoneNumber);
    
    if (role === 'stadium_owner' || role === 'normal_user') {
        updateData.role = role as UserRole;
    }

    if (password) {
        updateData.hashedPassword = await hashPassword(password);
    }

    if (email && email !== user.email) {
        const emailExists = await prisma.user.findUnique({
            where: { email }
        });

        if (emailExists) {
            res.status(400).json({ error: "A user with this email already exists." });
            return;
        }
        updateData.email = email;
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData
    });

    const token = signToken(updatedUser as any);

    res.status(200).json({ token, user: sanitizeUser(updatedUser as any) });
});

profileRouter.post("/photo", authMiddleware, uploadProfilePhoto.single("photo"), async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId || !req.file) {
        res.status(400).json({ error: "Invalid request" });
        return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    await deleteLocalProfilePhoto(user.imageUrl);

    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { imageUrl }
    });

    res.status(200).json({ imageUrl: updatedUser.imageUrl, user: sanitizeUser(updatedUser as any) });
});

profileRouter.delete('/photo', authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(400).json({ error: 'Invalid request' });
        return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    await deleteLocalProfilePhoto(user.imageUrl);

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { imageUrl: DEFAULT_USER_IMAGE }
    });

    res.status(200).json({ imageUrl: updatedUser.imageUrl, user: sanitizeUser(updatedUser as any) });
});

profileRouter.delete('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(400).json({ error: 'Invalid request' });
        return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, include: { stadiums: { include: { images: true } } } });
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    await deleteLocalProfilePhoto(user.imageUrl);
    for (const stadium of user.stadiums) {
        for (const image of stadium.images) {
            await deleteLocalStadiumImage(image.url);
        }
    }

    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({ message: 'Account deleted successfully.' });
});

export default profileRouter;
