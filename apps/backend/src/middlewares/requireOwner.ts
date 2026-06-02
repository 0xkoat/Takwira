import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const requireOwner = (req: AuthRequest, res: Response, next: NextFunction): void => {
    
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized: User not authenticated' });
        return;
    }
    
    if (req.user.role !== 'stadium_owner') {
        res.status(403).json({ error: 'Forbidden: Only owners can perform this action' });
        return;
    }
    next();
};
