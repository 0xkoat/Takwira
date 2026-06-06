import express, { Request, Response, Router } from "express";
import { getUsers } from "../utils/userStore";
import { comparePassword, signToken } from "../utils/authUtils";
import { sanitizeUser } from "../utils/userUtils";

const logInRouter: Router = express.Router();

logInRouter.post('/', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
    }

    const users = await getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }
    
    const isPasswordValid = await comparePassword(password, user.hashedPassword);
    if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }

    const token = signToken(user);

    res.status(200).json({ 
        token,
        user: sanitizeUser(user)
    });
});

export default logInRouter;