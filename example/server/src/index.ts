import "dotenv/config";
import OAuth from "./lib/oauth.js";
import express, { json } from "express";
import cors from "cors";

const PORT = process.env["PORT"] || "3000";
const GOOGLE_CLIENT_SECRET = process.env["GOOGLE_CLIENT_SECRET"] as string;
const GOOGLE_CLIENT_ID = process.env["GOOGLE_CLIENT_ID"] as string;
const GOOGLE_TOKEN_URL = process.env["GOOGLE_TOKEN_URL"] as string;

const app = express();

app.use(cors());
app.use(json());

const oauth = new OAuth();
oauth.setupProvider("google", {
  baseUrl: GOOGLE_TOKEN_URL,
  clientSecret: GOOGLE_CLIENT_SECRET,
  clientId: GOOGLE_CLIENT_ID,
  onSuccess: ({ res, data }) => {
    console.log("successful login:", data);
    res.json(data);
  },
  onFailure: ({ res, error }) => {
    console.log("failure:", error);
    res.status(500).json({ error: error.message });
  },
});
app.use("/oauth/exchange", oauth.authenticate());

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
