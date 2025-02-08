import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import {
  generateEncodedUrlState,
  getEncodedUrlState,
  parseUrlState,
  setEncodedUrlState,
} from "./url_state";

export type OAuthProviderData = {
  login: () => void;
  loading: boolean;
};

export const OAuthContext = createContext<OAuthProviderData | null>(null);

type OAuthProviderProps = {
  clientId: string;
  callbackUrl: string;
  onSuccess?: (response: Response) => void | Promise<void>;
  onError?: (reason: unknown) => void | Promise<void>;
  scope?: string;
  children?: ReactNode;
};

export function OAuthContextProvider({
  clientId,
  callbackUrl,
  scope,
  onSuccess,
  onError,
  children,
}: OAuthProviderProps) {
  const login = useCallback(() => {
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    const state = generateEncodedUrlState("google");
    setEncodedUrlState(state);
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", window.location.origin);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", scope ?? "email profile");
    authUrl.searchParams.set("state", state);
    window.location.href = authUrl.toString();
  }, [clientId, scope]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const oauthRedirected =
      queryParams.has("code") && queryParams.get("state") === getEncodedUrlState();
    if (!oauthRedirected) {
      return;
    }
    console.log(parseUrlState(queryParams.get("state") as string));
    setLoading(true);
    void fetch(callbackUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: queryParams.get("code"),
        client_id: clientId,
        redirect_uri: window.location.origin,
        grant_type: "authorization_code",
      }),
    })
      .then(onSuccess, onError)
      .finally(() => {
        setLoading(false);
      });
  }, [callbackUrl, clientId, onError, onSuccess]);

  return <OAuthContext.Provider value={{ login, loading }}>{children}</OAuthContext.Provider>;
}
