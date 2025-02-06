import { HttpCode } from "@/util/http-code.js";
import oauth from "@/services/oauth.js";
import { Router } from "express";

export const oauthRouter = Router();

oauthRouter.get("/exchange", (req, res) => {
  if (!req.query["code"] || typeof req.query["code"] !== "string") {
    res.status(HttpCode.BadRequest).send("Missing code");
    return;
  }
  const code = req.query["code"];
  const data = oauth.exchangeCode(code);
  res.status(HttpCode.Good).json(data);
});
