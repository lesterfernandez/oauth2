import { Request, Response, NextFunction } from "express";
import oauthService, { IdTokenPayload } from "@/services/oauth.js";

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
  clientSecret: string;
  baseUrl: string;
};

const providers: Record<string, Provider> = {};

const OAuth = (function () {
  return {
    setupProvider(provider: string, { baseUrl, clientSecret, onSuccess, onFailure }: Provider) {
      providers[provider] = {
        baseUrl,
        clientSecret,
        onSuccess,
        onFailure,
      };
    },

    authenticate(providerName: string) {
      return (req: Request, res: Response, next: NextFunction) => {
        if (!providers[providerName]) {
          throw new Error(`Provider ${providerName} has not been set`);
        }
        const { onSuccess, onFailure, clientSecret, baseUrl } = providers[providerName];

        const requiredFields = ["code", "client_id", "redirect_uri", "grant_type"];
        for (const field of requiredFields) {
          if (!req.body[field] || typeof req.body[field] !== "string") {
            const error = new Error(`Missing field: ${field}`);
            return onFailure({ req, res, error });
          }
        }

        const {
          code,
          grant_type: grantType,
          redirect_uri: redirectUri,
          client_id: clientId,
        } = req.body;

        oauthService
          .exchangeCode({ baseUrl, code, grantType, clientId, redirectUri, clientSecret })
          .then(data => onSuccess({ req, res, data: data as IdTokenPayload }))
          .catch(err => onFailure({ req, res, error: err as Error }))
          .finally(() => next);
      };
    },
  };
})();

export default OAuth;
