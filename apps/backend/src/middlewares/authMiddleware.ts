import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        res.status(500).json({ error: 'Server configuration error: JWT_SECRET missing' });
        return;
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
    }
};
