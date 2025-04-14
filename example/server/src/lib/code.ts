import jwt from "jsonwebtoken";

type TokenError = {
  error: string;
  error_description: string;
};

interface TokenPayload {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
}

export interface IdTokenPayload {
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

type ExchangeOptions = {
  tokenUrl: string;
  code: string;
  grantType: string;
  redirectUri: string;
  clientId: string;
  clientSecret: string;
};

export async function exchangeCode(params: ExchangeOptions): Promise<IdTokenPayload | Error> {
  const { tokenUrl, grantType, code, clientId, redirectUri, clientSecret } = params;

  const res = await fetch(tokenUrl, {
    method: "POST",
    body: JSON.stringify({
      grant_type: grantType,
      code: code,
      client_id: clientId,
      redirect_uri: redirectUri,
      client_secret: clientSecret,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const { error } = (await res.json()) as TokenError;
    throw new Error(`Token exchange error. status: ${res.status}, error: ${error}`);
  }

  const json = await res.json();
  console.log("authenticated!: ", JSON.stringify(json, null, 2));
  const { id_token: idToken } = json as TokenPayload;

  const decoded = jwt.decode(idToken) as IdTokenPayload;
  return decoded;
}
