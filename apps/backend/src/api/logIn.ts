import express, { Request, Response, Router } from "express";
import { z } from "zod";
import { getUsers } from "../utils/userStore";
import { comparePassword, signToken } from "../utils/authUtils";
import { sanitizeUser } from "../utils/userUtils";
import { validate } from "../middlewares/validateMiddleware";

const logInRouter: Router = express.Router();

const logInSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password is required"),
    }),
});

logInRouter.post('/', validate(logInSchema), async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

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