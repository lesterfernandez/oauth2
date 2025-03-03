import { Router } from "express";
import OAuth from "../middleware/oauth.js";

const oauthRouter = Router();

oauthRouter.post("/exchange", OAuth.authenticate("google"));

export default oauthRouter;
