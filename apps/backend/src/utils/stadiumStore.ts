import fs from "fs/promises";
import path from "path";
import { Stadium } from "@takwira/shared";

const STADIUMS_FILE = path.resolve(__dirname, "../data/stadiums.json");

export const getStadiums = async (): Promise<Stadium[]> => {
    try {
        const data = await fs.readFile(STADIUMS_FILE, "utf-8");
        return JSON.parse(data);
    } catch (e) {
        console.error("Error reading stadiums file", e);
        return [];
    }
};

export const persistStadiums = async (stadiums: Stadium[]): Promise<void> => {
    try {
        await fs.writeFile(STADIUMS_FILE, JSON.stringify(stadiums, null, 2), "utf-8");
    } catch (e) {
        console.error("Error writing stadiums file", e);
        throw new Error("Failed to save stadium data.");
    }
};
