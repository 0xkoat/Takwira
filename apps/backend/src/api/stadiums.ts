import express, { Request, Response, Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";
import { requireOwner } from "../middlewares/requireOwner";
import { validate } from "../middlewares/validateMiddleware";
import { uploadStadiumImages, deleteLocalStadiumImage } from "../utils/stadiumImagesUtils";

const stadiumsRouter: Router = express.Router();

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


stadiumsRouter.post('/', authMiddleware, requireOwner, uploadStadiumImages.array('images', 10), validate(createStadiumSchema), async (req: AuthRequest, res: Response) => {
    const { name, address, capacity, pricePerHour, description } = req.body;
    
    const ownerId = req.user?.userId;
    if (!ownerId) {
        res.status(500).json({ error: 'Internal Server Error: User ID missing from token' });
        return;
    }

    const files = (req.files as Express.Multer.File[]) ?? [];

    const newStadium = await prisma.stadium.create({
        data: {
            ownerId: ownerId,
            name,
            city: address,
            locationURL: '',
            price: pricePerHour,
            placesNum: capacity,
            description: description ?? '',
            images: {
                create: files.map((f) => ({
                    url: `/uploads/stadiums/${f.filename}`,
                }))
            },
            principalImageId: files.length > 0 ? undefined : null,
        },
        include: {
            images: true,
            owner: {
                select: {
                    id: true,
                    username: true,
                    imageUrl: true,
                    phoneNumber: true,
                }
            }
        }
    });
    if (newStadium.images.length > 0) {
        await prisma.stadium.update({
            where: { id: newStadium.id },
            data: { principalImageId: newStadium.images[0].id }
        });
    }

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

stadiumsRouter.post('/:id/images', authMiddleware, requireOwner, uploadStadiumImages.array('images', 10), async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const stadiumId = parseInt(id);

    const stadium = await prisma.stadium.findUnique({
        where: { id: stadiumId },
        include: { images: true }
    });

    if (!stadium) {
        res.status(404).json({ error: 'Stadium not found' });
        return;
    }

    if (stadium.ownerId !== req.user?.userId) {
        res.status(403).json({ error: 'Forbidden: You do not own this stadium' });
        return;
    }

    const currentImageCount = stadium.images.length;
    if (currentImageCount >= 10) {
        res.status(400).json({ error: 'Stadium already has maximum of 10 images' });
        return;
    }

    const files = (req.files as Express.Multer.File[]) ?? [];
    const canAddCount = Math.min(files.length, 10 - currentImageCount);

    const filesToAdd = files.slice(0, canAddCount);

    const updatedStadium = await prisma.stadium.update({
        where: { id: stadiumId },
        data: {
            images: {
                create: filesToAdd.map((f) => ({
                    url: `/uploads/stadiums/${f.filename}`,
                }))
            }
        },
        include: { images: true, owner: { select: { id: true, username: true, imageUrl: true, phoneNumber: true } } }
    });

    res.status(201).json(updatedStadium);
});

stadiumsRouter.delete('/:id/images/:imageId', authMiddleware, requireOwner, validate(stadiumIdSchema), async (req: AuthRequest, res: Response): Promise<void> => {
    const { id, imageId } = req.params;
    const stadiumId = parseInt(id);

    const stadium = await prisma.stadium.findUnique({
        where: { id: stadiumId },
        include: { images: true }
    });

    if (!stadium) {
        res.status(404).json({ error: 'Stadium not found' });
        return;
    }

    if (stadium.ownerId !== req.user?.userId) {
        res.status(403).json({ error: 'Forbidden: You do not own this stadium' });
        return;
    }

    const image = await prisma.image.findUnique({
        where: { id: imageId }
    });

    if (!image || image.stadiumId !== stadiumId) {
        res.status(404).json({ error: 'Image not found' });
        return;
    }

    await deleteLocalStadiumImage(image.url);

    await prisma.image.delete({
        where: { id: imageId }
    });

    let updatedStadium = await prisma.stadium.findUnique({
        where: { id: stadiumId },
        include: { images: true }
    });

    if (stadium.principalImageId === imageId && updatedStadium && updatedStadium.images.length > 0) {
        updatedStadium = await prisma.stadium.update({
            where: { id: stadiumId },
            data: { principalImageId: updatedStadium.images[0].id },
            include: { images: true, owner: { select: { id: true, username: true, imageUrl: true, phoneNumber: true } } }
        });
    }

    res.json(updatedStadium);
});

stadiumsRouter.put('/:id/images/:imageId/principal', authMiddleware, requireOwner, validate(stadiumIdSchema), async (req: AuthRequest, res: Response): Promise<void> => {
    const { id, imageId } = req.params;
    const stadiumId = parseInt(id);

    const stadium = await prisma.stadium.findUnique({
        where: { id: stadiumId },
        include: { images: true }
    });

    if (!stadium) {
        res.status(404).json({ error: 'Stadium not found' });
        return;
    }

    if (stadium.ownerId !== req.user?.userId) {
        res.status(403).json({ error: 'Forbidden: You do not own this stadium' });
        return;
    }

    const image = await prisma.image.findUnique({
        where: { id: imageId }
    });

    if (!image || image.stadiumId !== stadiumId) {
        res.status(404).json({ error: 'Image not found' });
        return;
    }

    const updatedStadium = await prisma.stadium.update({
        where: { id: stadiumId },
        data: { principalImageId: imageId },
        include: { images: true, owner: { select: { id: true, username: true, imageUrl: true, phoneNumber: true } } }
    });

    res.json(updatedStadium);
});

export default stadiumsRouter;
