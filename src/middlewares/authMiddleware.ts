import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const authMiddleware = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authToken = req.headers.authorization?.split(" ")[1];

      if (!authToken) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!",
        });
      }

      const decoded = jwt.verify(
        authToken,
        String(config.jwt_secret),
      ) as JwtPayload;

      req.user = decoded;

      if (!(roles?.length && roles.includes("admin"))) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!",
        });
      }

      next();
    } catch (err: any) {
      return res.status(401).json({
        success: false,
        message: err.message,
      });
    }
  };
};

export default authMiddleware;
