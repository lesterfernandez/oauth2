import { fetchOAuth, requestType } from "@/fetch/fetch-api";
import { createContext, useEffect, useState, type ReactNode } from "react";

type OAuthProviderProps = {
  callbackUrl: string;
  children?: ReactNode;
};

// TODO: create types for every response T
type OAuthServerResponse<T = any> = {
  success: boolean;
  error: string;
  code: number;
  content?: T;
};

// TODO: decide if User has to be provided for type safety if the user wants to add more info
// this also applies on all other functions (login, register)
type User = {
  username: string;
  img: string;
};

export type OAuthProviderData = {
  login: () => void;
  logout: () => boolean;
  loading: boolean;
  user: User | undefined;
};

export const OAuthContext = createContext<OAuthProviderData>({
  login: () => {},
  logout: () => false,
  loading: false,
  user: undefined,
});

export const OAuthContextProvider = ({ callbackUrl, children }: OAuthProviderProps) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: detect window location to trigger login/register workflow
    if (window.location.href == "something") {
      loadSession();
    }
  }, []);

  const loadSession = async () => {
    setLoading(true);
    try {
      const response = await fetchOAuth<OAuthServerResponse<User>>(
        requestType.POST,
        callbackUrl,
        "/oauth/session",
        {
          sessionToken: "some session token",
        }
      );

      if (response.success) {
        setUser(response.content);
      }

      return {
        success: true,
        error: `not implemented.`,
        code: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: `error occurred, ${error}`,
        code: 500,
      };
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    const clientid = 123;
    const redirectURI = "some uri";
    const scope = "email";

    // TODO: add redirect
    window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${clientid}&redirect_uri=${redirectURI}&scope=${scope}&response_type=code`;
  };

  const logout = (): boolean => {
    // TODO: remove any session info within cookies/localStorage
    setUser(undefined);

    return true;
  };

  return (
    <OAuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </OAuthContext.Provider>
  );
};
