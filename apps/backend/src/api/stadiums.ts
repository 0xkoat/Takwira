import express, { Request, Response, Router } from "express";
import { stadiums } from "../data/stadiums";
import { Stadium } from "@takwira/shared";

const stadiumsRouter : Router = express.Router() ;

const parseNumericValue = (val: string) => {
    const match = val.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : NaN;
};

stadiumsRouter.get('/', (req: Request, res: Response) => {
    const { city, minPrice, maxPrice, exactPlaces } = req.query;
    let filteredStadiums: Stadium[] = stadiums;

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
    
})

export default stadiumsRouter;
