import { defaultProviders, type DefaultProvider } from "./defaults";
import { generateState, getState, parseState, setState } from "./state";

export type RedirectOptions = (
  | {
      provider: DefaultProvider;
      clientId: string;
    }
  | { provider: DefaultProvider; clientId: string; authUrl: string }
  | { provider: string; clientId: string; authUrl: string }
) & {
  scope?: string;
};

export function redirectToProvider(options: RedirectOptions) {
  const authUrl =
    "authUrl" in options ? options.authUrl : defaultProviders[options.provider].authUrl;
  const url = new URL(authUrl);
  const scope = options.scope ?? "email profile";
  const state = generateState(options.provider);
  setState(state);
  url.searchParams.set("client_id", options.clientId);
  url.searchParams.set("redirect_uri", window.location.origin);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scope);
  url.searchParams.set("state", state);
  window.location.href = url.toString();
}

export function detectRedirect() {
  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get("code");
  const urlState = queryParams.get("state");
  const storedState = getState();
  const oauthRedirected = code && urlState && urlState === storedState;
  if (!oauthRedirected) {
    return null;
  }
  const state = parseState(storedState);
  if (!state) {
    return null;
  }
  return { ...state, code };
}
