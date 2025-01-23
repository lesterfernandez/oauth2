import { OAuthContext, type OAuthProviderData } from "@/contexts/OAuthProvider";
import { useContext } from "react";

export const useAuth = (): OAuthProviderData => {
  const context = useContext(OAuthContext);

  if (!context) {
    console.error("OAuthContextProvider needs to be added at root in order to use useAuth");
  }

  return context;
};
