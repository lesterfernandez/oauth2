import "dotenv/config";
import OAuth from "./middleware/oauth.js";
import express, { json } from "express";
import cors from "cors";
import attachRouters from "./routers/index.js";
import { HttpCode } from "./util/http-code.js";

const PORT = process.env["PORT"] || "3000";
const GOOGLE_CLIENT_SECRET = process.env["GOOGLE_CLIENT_SECRET"] as string;

OAuth.setupProvider("google", {
  baseUrl: "https://oauth2.googleapis.com/token",
  clientSecret: GOOGLE_CLIENT_SECRET,
  onSuccess: ({ res, data }) => {
    res.status(200).json(data);
  },
  onFailure: ({ res, error }) => {
    res.status(500).json({ error: error.message });
  },
});

const app = express();

app.use(cors());
app.use(json());
attachRouters(app);

app.use((_, res) => {
  res.status(HttpCode.NotFound).send("Invalid path");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
