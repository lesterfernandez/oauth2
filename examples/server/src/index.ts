import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import oauth from "./oauth.js";

const PORT = process.env["PORT"] || "3000";

const app = express();

app.use(cors());
app.use(json());

app.use("/oauth/exchange", oauth.authenticate());

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
