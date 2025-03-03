import { Express } from "express";
import oauthRouter from "./oauth-router.js";

enum Routes {
  OAUTH = "/oauth",
}

const attachRouters = (app: Express) => {
  app.use(Routes.OAUTH, oauthRouter);
};

export default attachRouters;
