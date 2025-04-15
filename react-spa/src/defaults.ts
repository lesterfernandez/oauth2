export const defaultProviders = {
  google: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
  },
};

export type DefaultProvider = keyof typeof defaultProviders;
