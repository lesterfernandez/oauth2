import oauth from "@/services/oauth.js";
import { HttpCode } from "@/util/http-code.js";
import { Router } from "express";

export const oauthRouter = Router();

oauthRouter.post("/exchange", async (req, res) => {
  const requiredFields = ["code", "client_id", "redirect_uri", "grant_type"];
  for (const field of requiredFields) {
    if (!req.body[field] || typeof req.body[field] !== "string") {
      res.status(HttpCode.BadRequest).send(`Missing ${field}`);
    }
  }

  const { code, grant_type, redirect_uri, client_id } = req.body;
  const data = await oauth.exchangeCode(code, client_id, redirect_uri, grant_type);
  res.status(HttpCode.Good).json(data);
});
