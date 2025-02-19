import GoogleOAuth from "@/middleware/oauth.js";
import { Router } from "express";

export const oauthRouter = Router();

oauthRouter.post(
  "/exchange",
  GoogleOAuth(
    ({ res, data }) => {
      res.status(200).json(data);
    },
    ({ res, error }) => {
      res.status(500).json({ error: error.message });
    }
  )
);
