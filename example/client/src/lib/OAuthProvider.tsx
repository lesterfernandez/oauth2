import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import {
  clearUrlCookie,
  generateUrlCookie,
  getUrlCookie,
  parseUrlState,
  setUrlCookie,
} from "./url_state";
import { defaultAuthUrls, type OAuthProvider } from "./providers";

type LoginParams =
  | {
      provider: OAuthProvider;
      clientId: string;
      authUrl?: string;
    }
  | { provider: string; clientId: string; authUrl: string };

export type OAuthProviderData = {
  startLoginFlow: (params: LoginParams) => void;
  logout?: () => void;
  loading: boolean;
};

export const OAuthContext = createContext<OAuthProviderData | null>(null);

type OAuthProviderProps = {
  callbackUrl: string;
  onSuccess?: (data: { response: Response; provider: string }) => void | Promise<void>;
  onError?: (data: { reason: unknown; provider: string }) => void | Promise<void>;
  onRedirect?: (data: { code: string; provider: string }) => void;
  scope?: string;
  callback?: boolean;
  children?: ReactNode;
};

export function OAuthContextProvider({
  callbackUrl,
  onSuccess,
  onError,
  onRedirect,
  scope,
  callback = true,
  children,
}: OAuthProviderProps) {
  const startLoginFlow = useCallback(
    (params: LoginParams) => {
      const url = new URL(params.authUrl ?? defaultAuthUrls(params.provider as OAuthProvider));
      const state = generateUrlCookie("google");
      setUrlCookie(state);
      url.searchParams.set("client_id", params.clientId);
      url.searchParams.set("redirect_uri", window.location.origin);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", scope ?? "email profile");
      url.searchParams.set("state", state);
      window.location.href = url.toString();
    },
    [scope]
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");
    const urlState = queryParams.get("state");
    const storedState = getUrlCookie();
    const oauthRedirected =
      code && urlState && urlState === storedState && parseUrlState(storedState);
    if (!oauthRedirected) {
      return;
    }
    clearUrlCookie();
    const { provider } = parseUrlState(storedState)!;
    if (onRedirect) {
      onRedirect({ code, provider });
    }
    if (!callback) {
      return;
    }
    setLoading(true);
    void fetch(callbackUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        provider,
        redirect_uri: window.location.origin,
        grant_type: "authorization_code",
      }),
    })
      .then(
        response => {
          if (onSuccess) {
            void onSuccess({ response, provider });
          }
        },
        reason => {
          if (onError) void onError({ reason, provider });
        }
      )
      .finally(() => {
        setLoading(false);
      });
  }, [callbackUrl, onError, onSuccess, onRedirect, callback]);

  return (
    <OAuthContext.Provider value={{ startLoginFlow, logout:() =>{}, loading }}>{children}</OAuthContext.Provider>
  );
}
