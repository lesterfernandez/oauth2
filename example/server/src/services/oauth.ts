import jwt from "jsonwebtoken";

interface TokenPayload {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
}

interface IdTokenPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}

const clientSecret = process.env["GOOGLE_CLIENT_SECRET"] as string;

const exchangeCode = async (
  code: string,
  grantType: string,
  clientId: string,
  redirectUri: string
) => {
  const url = new URL("https://oauth2.googleapis.com/token");
  url.searchParams.set("grant_type", grantType);
  url.searchParams.set("code", code);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("client_secret", clientSecret);

  fetch(url, { method: "POST" })
    .then(res => res.json())
    .then(json => {
      const { id_token: idToken } = json as TokenPayload;

      const decoded = jwt.decode(idToken) as IdTokenPayload;
      return decoded;
    });
};

export default {
  exchangeCode,
};
