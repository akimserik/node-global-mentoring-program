import { ValidateFunction } from "ajv";
import { NextFunction, Request, Response } from "express";

const validateRequest = (ajvValidate: ValidateFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const valid = ajvValidate(req.body);
    if (!valid) {
      const errors = ajvValidate.errors;
      res.status(400).json(errors);
    } else {
      next();
    }
  };
};

export { validateRequest };
