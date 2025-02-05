import { createBadRequestError } from "@/middleware/error.js";
import { Request, Response, NextFunction } from "express";

const exchangeToken = (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.query;

  if (!code) {
    return next(createBadRequestError("Missing code"));
  }
  res.status(200).json({ code });
};

const oauthRepository = {
  exchangeToken,
};

export default oauthRepository;
