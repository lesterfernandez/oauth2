import jwt from "jsonwebtoken";

type TokenError = {
  error: string;
  error_description: string;
};

export interface TokenPayload {
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

type ExchangeCodeParams = {
  baseUrl: string;
  code: string;
  grantType: string;
  clientId: string;
  redirectUri: string;
  clientSecret: string;
};

const exchangeCode = async (params: ExchangeCodeParams): Promise<IdTokenPayload | Error> => {
  const { baseUrl, grantType, code, clientId, redirectUri, clientSecret } = params;

  const res = await fetch(baseUrl, {
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
  const { id_token: idToken } = json as TokenPayload;

  const decoded = jwt.decode(idToken) as IdTokenPayload;
  return decoded;
};

export default {
  exchangeCode,
};
