import express, { Request, Response, Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { Stadium } from "@takwira/shared";

const STADIUMS_FILE = path.resolve(__dirname, "../data/stadiums.json");

let stadiums: Stadium[] = [];
if (fs.existsSync(STADIUMS_FILE)) {
    stadiums = JSON.parse(fs.readFileSync(STADIUMS_FILE, "utf-8"));
}

const persistStadiums = () => {
    fs.writeFileSync(STADIUMS_FILE, JSON.stringify(stadiums, null, 2), "utf-8");
};

const stadiumsRouter: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const parseNumericValue = (val: string) => {
    const match = val.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : NaN;
};


stadiumsRouter.get('/', (req: Request, res: Response) => {
    const { city, minPrice, maxPrice, exactPlaces, ownerId } = req.query;
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
            filteredStadiums = filteredStadiums.filter(s => parseNumericValue(s.price) >= parsedMin);
        }
    }

    if (typeof maxPrice === 'string' && maxPrice.trim()) {
        const parsedMax = parseFloat(maxPrice);
        if (!isNaN(parsedMax)) {
            filteredStadiums = filteredStadiums.filter(s => parseNumericValue(s.price) <= parsedMax);
        }
    }

    const exactPlacesVal = typeof exactPlaces === 'string' ? exactPlaces.trim() : null;
    if (exactPlacesVal) {
        const parsedPlaces = parseInt(exactPlacesVal);
        if (!isNaN(parsedPlaces)) {
            filteredStadiums = filteredStadiums.filter(stadium => {
                const placesNum = parseInt(stadium.placesNum);
                return !isNaN(placesNum) && placesNum === parsedPlaces;
            });
        }
    }

    res.json(filteredStadiums);
});


stadiumsRouter.post('/', upload.array('images'), (req: Request, res: Response) => {
    const { name, address, capacity, pricePerHour, description, ownerId, ownerName, ownerNumber } = req.body;

    const files = (req.files as Express.Multer.File[]) ?? [];
    const imageUrls = files.map((f) => `data:${f.mimetype};base64,${f.buffer.toString('base64')}`);

    const newStadium: Stadium = {
        id: stadiums.length + 1,
        ownerId: parseInt(ownerId) || 0,
        name,
        ownerName: ownerName ?? 'Unknown',
        ownerNumber: ownerNumber ?? 'Unknown',
        city: address,
        locationURL: '',
        images: imageUrls,
        principalImageUrl: imageUrls[0] ?? '',
        price: `${pricePerHour} TND/hour`,
        placesNum: String(capacity),
        description: description ?? '',
    };

    stadiums.push(newStadium);
    persistStadiums();
    res.status(201).json(newStadium);
});


stadiumsRouter.put('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
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
        placesNum: capacity ? String(capacity) : stadiums[index].placesNum,
        price: pricePerHour ? `${pricePerHour} TND/hour` : stadiums[index].price,
        description: description ?? stadiums[index].description,
    };

    persistStadiums();
    res.json(stadiums[index]);
});

stadiumsRouter.delete('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = stadiums.findIndex(s => s.id === id);

    if (index === -1) {
        res.status(404).json({ error: 'Stadium not found' });
        return;
    }

    const deleted = stadiums.splice(index, 1)[0];
    persistStadiums();
    res.json(deleted);
});

export default stadiumsRouter;
