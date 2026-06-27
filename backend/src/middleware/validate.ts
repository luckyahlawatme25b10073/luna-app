// src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

// Validation middleware using Zod
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors[0]?.message || 'Validation failed' });
    }
    // IMPORTANT: assign the parsed (and transformed) data back to req.body
    // so that z.preprocess transforms (e.g. string → Date) are applied
    req.body = result.data;
    next();
  };
};

// Query parameter validation middleware
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors[0]?.message || 'Query validation failed' });
    }
    req.query = result.data;
    next();
  };
};

// Parameter validation middleware
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors[0]?.message || 'Parameter validation failed' });
    }
    req.params = result.data;
    next();
  };
};

export default { validate, validateQuery, validateParams };