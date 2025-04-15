import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { clearState } from "./state";
import { detectRedirect, redirectToProvider } from "./redirect";

type OAuthProviderData = {
  redirectToProvider: typeof redirectToProvider;
  loading: boolean;
};

export const OAuthSpaContext = createContext<OAuthProviderData | null>(null);

type OAuthProviderProps = {
  callbackUrl: string;
  onSuccess?: (data: { response: Response; provider: string }) => void | Promise<void>;
  onError?: (data: { reason: unknown; provider: string }) => void | Promise<void>;
  onRedirect?: (data: { code: string; provider: string }) => void;
  exchange?: boolean;
  children?: ReactNode;
};

export function OAuthSpaProvider({
  callbackUrl,
  onSuccess,
  onError,
  onRedirect,
  exchange = true,
  children,
}: OAuthProviderProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const state = detectRedirect();
    if (!state) {
      return;
    }
    clearState();
    if (onRedirect) {
      onRedirect({ code: state.code, provider: state.provider });
    }
    if (!exchange) {
      return;
    }
    setLoading(true);
    void fetch(callbackUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: state.code,
        provider: state.provider,
        redirect_uri: window.location.origin,
        grant_type: "authorization_code",
      }),
    })
      .then(
        response => {
          if (onSuccess) {
            void onSuccess({ response, provider: state.provider });
          }
        },
        reason => {
          if (onError) void onError({ reason, provider: state.provider });
        }
      )
      .finally(() => {
        setLoading(false);
      });
  }, [callbackUrl, onError, onSuccess, onRedirect, exchange]);

  return (
    <OAuthSpaContext.Provider value={{ redirectToProvider, loading }}>
      {children}
    </OAuthSpaContext.Provider>
  );
}

export const useOAuth = () => {
  const contextValue = useContext(OAuthSpaContext);

  if (!contextValue) {
    throw new Error("Provider needs to be added at root in order to use useAuth");
  }

  return contextValue;
};
