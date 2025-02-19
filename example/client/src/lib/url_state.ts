const OAUTH_URL_STATE_KEY = "oauth_state";
const OAUTH_CLIENT_ID_STATE_KEY = "oauth_client_id";

const generateNonce = () => {
  const randomBytes = window.crypto.getRandomValues(new Uint8Array(4));
  const randomString = Array.from(randomBytes, num => String.fromCodePoint(num)).join("");
  return btoa(randomString);
};

export const generateEncodedUrlState = (provider: string) => {
  Array.from(window.crypto.getRandomValues(new Uint8Array(3)), num => num.toString(16));
  return encodeURIComponent(`${provider}:${generateNonce()}`);
};

export const getEncodedUrlState = () => localStorage.getItem(OAUTH_URL_STATE_KEY);
export const setEncodedUrlState = (encodedState: string) => {
  localStorage.setItem(OAUTH_URL_STATE_KEY, encodedState);
};

export const parseUrlState = (state: string) => {
  const decodedState = decodeURIComponent(state);
  if (!decodedState.includes(":") || decodedState.length < 3) {
    return null;
  }
  const [provider, nonce] = decodedState.split(":");
  return { provider, nonce };
};

export const setRedirectClientId = (clientId: string) => {
  localStorage.setItem(OAUTH_CLIENT_ID_STATE_KEY, clientId);
};
export const getRedirectClientId = () => localStorage.getItem(OAUTH_CLIENT_ID_STATE_KEY);
export const clearRedirectClientId = () => void localStorage.removeItem(OAUTH_CLIENT_ID_STATE_KEY);
