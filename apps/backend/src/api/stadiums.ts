import express, { Request, Response, Router } from "express";
import multer from "multer";
import { z } from "zod";
import { prisma } from "../utils/prisma";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";
import { requireOwner } from "../middlewares/requireOwner";
import { validate } from "../middlewares/validateMiddleware";

const stadiumsRouter: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const getStadiumsSchema = z.object({
    query: z.object({
        city: z.string().optional(),
        minPrice: z.coerce.number().optional(),
        maxPrice: z.coerce.number().optional(),
        exactPlaces: z.coerce.number().int().optional(),
        ownerId: z.coerce.number().int().optional(),
    }),
});

const createStadiumSchema = z.object({
    body: z.object({
        name: z.string().min(3, "Stadium name must be at least 3 characters"),
        address: z.string().min(5, "Address is too short"),
        capacity: z.coerce.number().int().positive("Capacity must be a positive integer"),
        pricePerHour: z.coerce.number().nonnegative("Price must be a non-negative number"),
        description: z.string().max(1000).optional(),
    }),
});

const updateStadiumSchema = z.object({
    body: z.object({
        name: z.string().min(3, "Stadium name must be at least 3 characters").optional(),
        address: z.string().min(5, "Address is too short").optional(),
        capacity: z.coerce.number().int().positive("Capacity must be a positive integer").optional(),
        pricePerHour: z.coerce.number().nonnegative("Price must be a non-negative number").optional(),
        description: z.string().max(1000).optional(),
    }),
});

const stadiumIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("Invalid stadium ID"),
    }),
});

stadiumsRouter.get('/', validate(getStadiumsSchema), async (req: Request, res: Response) => {
    
    const { city, minPrice, maxPrice, exactPlaces, ownerId } = req.query as any;
    const where: any = {};

    if (ownerId !== undefined) {
        where.ownerId = ownerId; 
    }

    if (city) {
        where.city = {
            contains: city.trim(),
            mode: 'insensitive',
        };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) {
            where.price.gte = minPrice;
        }
        if (maxPrice !== undefined) {
            where.price.lte = maxPrice;
        }
    }

    if (exactPlaces !== undefined) {
        where.placesNum = Number(exactPlaces);
    }

    const filteredStadiums = await prisma.stadium.findMany({
        where,
        include: {
            owner: {
                select: {
                    id: true,
                    username: true,
                    imageUrl: true,
                    phoneNumber: true,
                }
            }
        },
    });

  
    res.json(filteredStadiums);
});


stadiumsRouter.post('/', authMiddleware, requireOwner, upload.array('images'), validate(createStadiumSchema), async (req: AuthRequest, res: Response) => {
    const { name, address, capacity, pricePerHour, description } = req.body;
    
    // authMiddleware and requireOwner already ensure req.user exists
    const ownerId = req.user?.userId;
    if (!ownerId) {
        res.status(500).json({ error: 'Internal Server Error: User ID missing from token' });
        return;
    }

    const files = (req.files as Express.Multer.File[]) ?? [];
    const imageUrls = files.map((f) => `data:${f.mimetype};base64,${f.buffer.toString('base64')}`);
    
    const newStadium = await prisma.stadium.create({
        data: {
            ownerId: ownerId,
            name,
            city: address,
            locationURL: '',
            images: imageUrls,
            principalImageUrl: imageUrls[0] ?? '',
            price: pricePerHour,
            placesNum: capacity,
            description: description ?? '',
        }
    });
 

    res.status(201).json(newStadium);
});


stadiumsRouter.put('/:id', authMiddleware, requireOwner, validate(stadiumIdSchema), validate(updateStadiumSchema), async (req: AuthRequest, res: Response): Promise<void> => {
    
    const { id } = req.params as unknown as z.infer<typeof stadiumIdSchema>['params'];
    const stadium = await prisma.stadium.findUnique({
        where: { id }
    });

    if (!stadium) {
        res.status(404).json({ error: 'Stadium not found' });
        return;
    }

    if (stadium.ownerId !== req.user?.userId) {
        res.status(403).json({ error: 'Forbidden: You do not own this stadium' });
        return;
    }

    const { name, address, capacity, pricePerHour, description } = req.body;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (address) updateData.city = address;
    if (capacity !== undefined) updateData.placesNum = capacity;
    if (pricePerHour !== undefined) updateData.price = pricePerHour;
    if (description !== undefined) updateData.description = description;

    const updatedStadium = await prisma.stadium.update({
        where: { id },
        data: updateData
    });

    res.json(updatedStadium);
});

stadiumsRouter.delete('/:id', authMiddleware, requireOwner, validate(stadiumIdSchema), async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params as unknown as z.infer<typeof stadiumIdSchema>['params'];
    
    const stadium = await prisma.stadium.findUnique({
        where: { id }
    });

    if (!stadium) {
        res.status(404).json({ error: 'Stadium not found' });
        return;
    }

    if (stadium.ownerId !== req.user?.userId) {
        res.status(403).json({ error: 'Forbidden: You do not own this stadium' });
        return;
    }

    await prisma.stadium.delete({
        where: { id }
    });

    res.json({ message: "Stadium deleted successfully" });
});

export default stadiumsRouter;
