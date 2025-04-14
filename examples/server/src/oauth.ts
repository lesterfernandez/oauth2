import { OAuth } from "@oauth2/express";

const GOOGLE_CLIENT_SECRET = process.env["GOOGLE_CLIENT_SECRET"] as string;
const GOOGLE_CLIENT_ID = process.env["GOOGLE_CLIENT_ID"] as string;
const GOOGLE_TOKEN_URL = process.env["GOOGLE_TOKEN_URL"] as string;

const oauth = new OAuth();

oauth.setupProvider("google", {
  tokenUrl: GOOGLE_TOKEN_URL,
  clientSecret: GOOGLE_CLIENT_SECRET,
  clientId: GOOGLE_CLIENT_ID,
  onSuccess: ({ res, data }) => {
    console.log("successful login:", data);
    res.json(data);
  },
  onFailure: ({ res, error }) => {
    console.log("failure:", error);
    res.status(401).json({ error: error.message });
  },
});

export default oauth;
