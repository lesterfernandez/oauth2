import express, { json } from "express";
import attachRouters from "./routers/index.js";
import { HttpCode } from "./util/http-code.js";

const PORT = process.env["PORT"] || "3000";
const app = express();

app.use(json());

attachRouters(app);

app.use((_, res) => {
  res.status(HttpCode.NotFound).send("Invalid path");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
