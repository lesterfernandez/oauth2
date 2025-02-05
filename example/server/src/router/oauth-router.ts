import oauthRepository from "@/repository/oauth.js";
import { Router } from "express";

const oauthRouter = Router();

oauthRouter.get("/exchange", oauthRepository.exchangeToken);

export default oauthRouter;
