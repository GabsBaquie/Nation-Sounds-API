import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";

// Étend Request pour inclure 'dto'
interface RequestWithDto<T> extends Request {
  dto?: T;
}

export const validateDto =
  <T>(DtoClass: new () => T) =>
  async (req: RequestWithDto<T>, res: Response, next: NextFunction) => {
    const dto = plainToInstance(DtoClass, req.body);
    const errors = await validate(dto as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }
    req.dto = dto;
    next();
  };
