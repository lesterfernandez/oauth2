const generateNonce = () => {
  const randomBytes = window.crypto.getRandomValues(new Uint8Array(4));
  const randomString = Array.from(randomBytes, num => String.fromCodePoint(num)).join("");
  return btoa(randomString);
};

export const generateEncodedUrlState = (provider: "google" | string) => {
  Array.from(window.crypto.getRandomValues(new Uint8Array(3)), num => num.toString(16));
  return encodeURIComponent(`${provider}:${generateNonce()}`);
};

const OAUTH_URL_STATE_KEY = "oauth_state";
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
