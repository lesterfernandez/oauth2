import oauthService, { IdTokenPayload } from "@/services/oauth.js";
import { Request, Response, NextFunction } from "express";

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

const GoogleOAuth = (
  onSuccess: (successCallback: OAuthSuccessCallback) => void | Promise<void>,
  onFailure: (errorCallback: OAuthFailureCallback) => void
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const requiredFields = ["code", "client_id", "redirect_uri", "grant_type"];
    for (const field of requiredFields) {
      if (!req.body[field] || typeof req.body[field] !== "string") {
        const error = new Error(`Missing field: ${field}`);
        return onFailure({ req, res, error });
      }
    }

    const { code, grant_type, redirect_uri, client_id } = req.body;
    oauthService
      .exchangeCode(code, grant_type, client_id, redirect_uri)
      .then(data => onSuccess({ req, res, data: data as IdTokenPayload }))
      .catch(err => onFailure({ req, res, error: err as Error }))
      .finally(() => next);
  };
};
export default GoogleOAuth;
