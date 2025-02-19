import { OAuthContext } from "@/lib/OAuthProvider";
import { useContext } from "react";

export const useOAuth = () => {
  const contextValue = useContext(OAuthContext);

  if (!contextValue) {
    throw new Error("OAuthContextProvider needs to be added at root in order to use useAuth");
  }

  return contextValue;
};
