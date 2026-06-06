import fs from "fs/promises";
import path from "path";
import { UserWithPassword } from "@takwira/shared";

const USERS_FILE = path.resolve(__dirname, "../data/users.json");

export const getUsers = async (): Promise<UserWithPassword[]> => {
    try {
        const data = await fs.readFile(USERS_FILE, "utf-8");
        return JSON.parse(data);
    } catch (e) {
        console.error("Error reading users file", e);
        return [];
    }
};

export const persistUsers = async (users: UserWithPassword[]): Promise<void> => {
    try {
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
    } catch (e) {
        console.error("Error writing users file", e);
        throw new Error("Failed to save user data.");
    }
};
