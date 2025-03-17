const OAUTH_STATE_KEY = "oauth_state";

export const generateUrlCookie = (provider: string) => {
  const nonce = Array.from(window.crypto.getRandomValues(new Uint8Array(3)), num =>
    num.toString(16)
  ).join("");
  return `${provider}:${nonce}`;
};

export const getUrlCookie = () =>
  document.cookie
    .split("; ")
    .find(row => row.startsWith(`${OAUTH_STATE_KEY}=`))
    ?.split("=")[1];

export const setUrlCookie = (state: string) => {
  if (document.cookie.includes(`${OAUTH_STATE_KEY}=`)) {
    const fields = document.cookie.split("; ");
    const idx = fields.findIndex(val => val.startsWith(OAUTH_STATE_KEY));
    fields[idx] = `${OAUTH_STATE_KEY}=${state}`;
    document.cookie = fields.join("; ");
    return;
  }
  document.cookie =
    (document.cookie ? `${document.cookie}; ` : "") +
    `${OAUTH_STATE_KEY}=${state}; SameSite=Strict`;
};

export const clearUrlCookie = () => {
  if (!document.cookie.includes(`${OAUTH_STATE_KEY}=`)) {
    return;
  }
  setUrlCookie("");
};

export const parseUrlState = (state: string) => {
  const decodedState = decodeURIComponent(state);
  if (!decodedState.includes(":") || decodedState.length < 3) {
    return null;
  }
  const [provider, nonce] = decodedState.split(":");
  return { provider, nonce };
};
