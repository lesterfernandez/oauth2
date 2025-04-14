import { Request, Response, NextFunction } from "express";
import { exchangeCode, IdTokenPayload } from "./code.js";

type OAuthSuccessCallback = {
  req: Request;
  res: Response;
  data: IdTokenPayload;
};

type OAuthFailureCallback = {
  req: Request;
  res: Response;
  error: Error;
};

type Provider = {
  onSuccess: (successCallback: OAuthSuccessCallback) => void | Promise<void>;
  onFailure: (errorCallback: OAuthFailureCallback) => void;
  tokenUrl: string;
  clientSecret: string;
  clientId: string;
};

export class OAuth {
  providers: Record<string, Provider> = {};

  setupProvider(providerName: string, provider: Provider) {
    this.providers[providerName] = {
      ...provider,
    };
  }

  authenticate() {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (req.method !== "POST") {
        return void res.sendStatus(405);
      }
      const providerName = req.body["provider"] ?? "";
      if (!providerName) {
        return void res.sendStatus(400);
      }
      if (!this.providers[providerName]) {
        throw new Error(`Provider ${providerName} has not been set`);
      }

      const { onSuccess, onFailure, clientSecret, clientId, tokenUrl } =
        this.providers[providerName];

      const requiredFields = ["code", "provider", "redirect_uri", "grant_type"];
      for (const field of requiredFields) {
        if (!req.body[field] || typeof req.body[field] !== "string") {
          const error = new Error(`Missing field: ${field}`);
          return void onFailure({ req, res, error });
        }
      }

      const { code, grant_type: grantType, redirect_uri: redirectUri } = req.body;

      exchangeCode({
        tokenUrl,
        code,
        grantType,
        clientId,
        redirectUri,
        clientSecret,
      })
        .then(data => onSuccess({ req, res, data: data as IdTokenPayload }))
        .catch(err => onFailure({ req, res, error: err as Error }))
        .finally(() => next);
    };
  }
}
