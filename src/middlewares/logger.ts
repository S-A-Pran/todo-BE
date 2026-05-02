import { NextFunction, Request, Response } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  console.log(`${new Date().toLocaleString()} ${req.path} ${req.method}`);
  next();
};

export default logger;
