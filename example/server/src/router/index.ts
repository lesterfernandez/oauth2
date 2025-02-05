import { Express } from "express";
import oauthRouter from "./oauth-router.js";

enum Routes {
  OAUTH = "/oauth",
}

const initRoutes = (app: Express) => {
  app.use(Routes.OAUTH, oauthRouter);
};

export default initRoutes;
