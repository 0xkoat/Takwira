import express, { Request, Response, Router } from "express";
import multer from "multer";
import { Stadium } from "@takwira/shared";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";
import { requireOwner } from "../middlewares/requireOwner";
import { normalizePhoneNumber } from "../utils/phoneUtils";
import { getStadiums, persistStadiums } from "../utils/stadiumStore";


const stadiumsRouter: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

stadiumsRouter.get('/', async (req: Request, res: Response) => {
    const { city, minPrice, maxPrice, exactPlaces, ownerId } = req.query;
    const stadiums = await getStadiums();
    let filteredStadiums: Stadium[] = stadiums;

    if (typeof ownerId === 'string' && ownerId.trim()) {
        const parsed = parseInt(ownerId);
        if (!isNaN(parsed)) {
            filteredStadiums = filteredStadiums.filter(s => s.ownerId === parsed);
        }
    }

    if (typeof city === 'string' && city.trim()) {
        const cityFilter = city.trim().toLowerCase();
        filteredStadiums = filteredStadiums.filter(s => s.city.toLowerCase().includes(cityFilter));
    }

    if (typeof minPrice === 'string' && minPrice.trim()) {
        const parsedMin = parseFloat(minPrice);
        if (!isNaN(parsedMin)) {
            filteredStadiums = filteredStadiums.filter(s => s.price >= parsedMin);
        }
    }

    if (typeof maxPrice === 'string' && maxPrice.trim()) {
        const parsedMax = parseFloat(maxPrice);
        if (!isNaN(parsedMax)) {
            filteredStadiums = filteredStadiums.filter(s => s.price <= parsedMax);
        }
    }

    const exactPlacesVal = typeof exactPlaces === 'string' ? exactPlaces.trim() : null;
    if (exactPlacesVal) {
        const parsedPlaces = parseInt(exactPlacesVal);
        if (!isNaN(parsedPlaces)) {
            filteredStadiums = filteredStadiums.filter(stadium => {
                return stadium.placesNum === parsedPlaces;
            });
        }
    }

    res.json(filteredStadiums);
});


stadiumsRouter.post('/', authMiddleware, requireOwner, upload.array('images'), async (req: AuthRequest, res: Response) => {
    const { name, address, capacity, pricePerHour, description, ownerName, ownerNumber } = req.body;
    
    const ownerId = req.user?.userId;
    const stadiums = await getStadiums();

    const files = (req.files as Express.Multer.File[]) ?? [];
    const imageUrls = files.map((f) => `data:${f.mimetype};base64,${f.buffer.toString('base64')}`);

    const lastId = stadiums.length > 0 ? Math.max(...stadiums.map(s => s.id)) : 0;
    const nextId = lastId + 1;
    const parsedPrice = parseFloat(pricePerHour) || 0;
    const parsedCapacity = parseInt(capacity) || 0;

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
        price: parsedPrice,
        placesNum: parsedCapacity,
        description: description ?? '',
    };

    stadiums.push(newStadium);
    await persistStadiums(stadiums);
    res.status(201).json(newStadium);
});


stadiumsRouter.put('/:id', authMiddleware, requireOwner, async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const stadiums = await getStadiums();
    const index = stadiums.findIndex(s => s.id === id);

    if (index === -1) {
        res.status(404).json({ error: 'Stadium not found' });
        return;
    }

    const { name, address, capacity, pricePerHour, description } = req.body;

    stadiums[index] = {
        ...stadiums[index],
        name: name ?? stadiums[index].name,
        city: address ?? stadiums[index].city,
        placesNum: capacity ? (parseInt(capacity) || stadiums[index].placesNum) : stadiums[index].placesNum,
        price: pricePerHour ? (parseFloat(pricePerHour) || stadiums[index].price) : stadiums[index].price,
        description: description ?? stadiums[index].description,
    };

    await persistStadiums(stadiums);
    res.json(stadiums[index]);
});

stadiumsRouter.delete('/:id', authMiddleware, requireOwner, async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const stadiums = await getStadiums();
    const index = stadiums.findIndex(s => s.id === id);

    if (index === -1) {
        res.status(404).json({ error: 'Stadium not found' });
        return;
    }

    const deleted = stadiums.splice(index, 1)[0];
    await persistStadiums(stadiums);
    res.json(deleted);
});

export default stadiumsRouter;
