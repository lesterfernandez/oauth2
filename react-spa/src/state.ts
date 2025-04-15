const OAUTH_STATE_KEY = "oauth_state";

export const generateState = (provider: string) => {
  const nonce = Array.from(window.crypto.getRandomValues(new Uint8Array(3)), num =>
    num.toString(16)
  ).join("");
  return `${provider}:${nonce}`;
};

export const getState = () =>
  document.cookie
    .split("; ")
    .find(cookie => cookie.startsWith(`${OAUTH_STATE_KEY}=`))
    ?.split("=")[1];

export const setState = (state: string) => {
  document.cookie = `${OAUTH_STATE_KEY}=${state}; SameSite=Strict`;
};

export const clearState = () => {
  if (!document.cookie.includes(`${OAUTH_STATE_KEY}=`)) {
    return;
  }
  setState("");
};

export const parseState = (state: string) => {
  const decodedState = decodeURIComponent(state);
  if (!decodedState.includes(":") || decodedState.length < 3) {
    return null;
  }
  const [provider, nonce] = decodedState.split(":");
  return { provider, nonce };
};
