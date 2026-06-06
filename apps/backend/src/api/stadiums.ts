import express, { Request, Response, Router } from "express";
import multer from "multer";
import { z } from "zod";
import { Stadium } from "@takwira/shared";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";
import { requireOwner } from "../middlewares/requireOwner";
import { normalizePhoneNumber } from "../utils/phoneUtils";
import { getStadiums, persistStadiums } from "../utils/stadiumStore";
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
        ownerName: z.string().optional(),
        ownerNumber: z.any().optional(),
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
    const stadiums = await getStadiums();
    let filteredStadiums: Stadium[] = stadiums;

    if (ownerId !== undefined) {
        filteredStadiums = filteredStadiums.filter(s => s.ownerId === ownerId);
    }

    if (city) {
        const cityFilter = city.trim().toLowerCase();
        filteredStadiums = filteredStadiums.filter(s => s.city.toLowerCase().includes(cityFilter));
    }

    if (minPrice !== undefined) {
        filteredStadiums = filteredStadiums.filter(s => s.price >= minPrice);
    }

    if (maxPrice !== undefined) {
        filteredStadiums = filteredStadiums.filter(s => s.price <= maxPrice);
    }

    if (exactPlaces !== undefined) {
        filteredStadiums = filteredStadiums.filter(s => s.placesNum === exactPlaces);
    }

    res.json(filteredStadiums);
});


stadiumsRouter.post('/', authMiddleware, requireOwner, upload.array('images'), validate(createStadiumSchema), async (req: AuthRequest, res: Response) => {
    const { name, address, capacity, pricePerHour, description, ownerName, ownerNumber } = req.body;
    
    const ownerId = req.user?.userId;
    const stadiums = await getStadiums();

    const files = (req.files as Express.Multer.File[]) ?? [];
    const imageUrls = files.map((f) => `data:${f.mimetype};base64,${f.buffer.toString('base64')}`);

    const lastId = stadiums.length > 0 ? Math.max(...stadiums.map(s => s.id)) : 0;
    const nextId = lastId + 1;

    const newStadium: Stadium = {
        id: nextId,
        ownerId: ownerId || 0,
        name,
        ownerName: ownerName ?? 'Unknown',
        ownerNumber: normalizePhoneNumber(ownerNumber),
        city: address,
        locationURL: '',
        images: imageUrls,
        principalImageUrl: imageUrls[0] ?? '',
        price: pricePerHour,
        placesNum: capacity,
        description: description ?? '',
    };

    stadiums.push(newStadium);
    await persistStadiums(stadiums);
    res.status(201).json(newStadium);
});


stadiumsRouter.put('/:id', authMiddleware, requireOwner, validate(stadiumIdSchema), validate(updateStadiumSchema), async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params as unknown as z.infer<typeof stadiumIdSchema>['params'];
    const stadiums = await getStadiums();
    const index = stadiums.findIndex(s => s.id === id);

    if (index === -1) {
        res.status(404).json({ error: 'Stadium not found' });
        return;
    }

    if (stadiums[index].ownerId !== req.user?.userId) {
        res.status(403).json({ error: 'Forbidden: You do not own this stadium' });
        return;
    }

    const { name, address, capacity, pricePerHour, description } = req.body;

    stadiums[index] = {
        ...stadiums[index],
        name: name ?? stadiums[index].name,
        city: address ?? stadiums[index].city,
        placesNum: capacity ?? stadiums[index].placesNum,
        price: pricePerHour ?? stadiums[index].price,
        description: description ?? stadiums[index].description,
    };

    await persistStadiums(stadiums);
    res.json(stadiums[index]);
});

stadiumsRouter.delete('/:id', authMiddleware, requireOwner, validate(stadiumIdSchema), async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params as unknown as z.infer<typeof stadiumIdSchema>['params'];
    const stadiums = await getStadiums();
    const index = stadiums.findIndex(s => s.id === id);

    if (index === -1) {
        res.status(404).json({ error: 'Stadium not found' });
        return;
    }

    if (stadiums[index].ownerId !== req.user?.userId) {
        res.status(403).json({ error: 'Forbidden: You do not own this stadium' });
        return;
    }

    const deleted = stadiums.splice(index, 1)[0];
    await persistStadiums(stadiums);
    res.json(deleted);
});

export default stadiumsRouter;
