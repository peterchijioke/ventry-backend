import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export const validateDto = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(dtoClass, req.body);
    const errors: ValidationError[] = await validate(dtoObject);

    if (errors.length > 0) {
      const error: any = new Error('Validation failed');
      error.status = 400;
      error.code = 'VALIDATION_ERROR';
      error.details = errors.map((e) => ({
        property: e.property,
        constraints: e.constraints,
      }));
      return next(error);
    }

    req.body = dtoObject;
    next();
  };
};