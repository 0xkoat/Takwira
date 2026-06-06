import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            if (parsed.body !== undefined) req.body = parsed.body;
            if (parsed.query !== undefined) req.query = parsed.query as any;
            if (parsed.params !== undefined) req.params = parsed.params as any;
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ 
                    error: error.errors[0].message 
                });
            }
            return next(error);
        }
    };
