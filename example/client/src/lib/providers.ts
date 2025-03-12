export const OAuthProviders = { GOOGLE: "google", GITHUB: "github" } as const;
export type OAuthProvider = (typeof OAuthProviders)[keyof typeof OAuthProviders];

export function defaultAuthUrls(provider: OAuthProvider): string {
  switch (provider) {
    case OAuthProviders.GOOGLE:
      return "https://accounts.google.com/o/oauth2/v2/auth";
    case OAuthProviders.GITHUB:
      return "";
  }
}
