import { OAuthSpaContext } from "@/lib/OAuthSpaProvider";
import { useContext } from "react";

export const useOAuth = () => {
  const contextValue = useContext(OAuthSpaContext);

  if (!contextValue) {
    throw new Error("Provider needs to be added at root in order to use useAuth");
  }

  return contextValue;
};
