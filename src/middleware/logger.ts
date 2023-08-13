import { Request, Response, NextFunction } from "express";

export default function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(`Request logged: ${req.method} ${req.path}`);
  next();
}
