import { makeRedirectUri, revokeAsync, startAsync } from "expo-auth-session";
import React, {
  useEffect,
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { generateRandom } from "expo-auth-session/build/PKCE";

import { api } from "../services/api";

interface User {
  id: number;
  display_name: string;
  email: string;
  profile_image_url: string;
}

interface AuthContextData {
  user: User;
  isLoggingOut: boolean;
  isLoggingIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthProviderData {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

const twitchEndpoints = {
  authorization: "https://id.twitch.tv/oauth2/authorize",
  revocation: "https://id.twitch.tv/oauth2/revoke",
};

function AuthProvider({ children }: AuthProviderData) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUser] = useState({} as User);
  const [userToken, setUserToken] = useState("");

  // get CLIENT_ID from environment variables

  const { CLIENT_ID } = process.env;

  useEffect(() => {
    api.defaults.headers.common["Client-Id"] = CLIENT_ID!;
  }, []);

  async function signIn() {
    try {
      setIsLoggingIn(true);
      const REDIRECT_URI = makeRedirectUri({ useProxy: true });
      const RESPONSE_TYPE = "token";
      const SCOPE = encodeURI("openid user:read:email user:read:follows");
      const FORCE_VERIFY = true;
      const STATE = generateRandom(30);
      const authUrl = `${twitchEndpoints.authorization}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&force_verify=${FORCE_VERIFY}&state=${STATE}`;
      const response = await startAsync({ authUrl });
      if (
        response.type === "success" &&
        response.params.error !== "access_denied"
      ) {
        if (response.params.state !== STATE) {
          throw new Error("Invalid state value");
        }
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.params.access_token}`;
        const userResponse = await api.get("/users");
        setUser(userResponse.data.data[0]);
        setUserToken(response.params.access_token);
      }
    } catch (error) {
      throw new Error();
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function signOut() {
    try {
      setIsLoggingIn(true);

      await revokeAsync(
        {
          token: userToken,
          clientId: CLIENT_ID,
        },
        {
          revocationEndpoint: twitchEndpoints.revocation,
        }
      );
    } catch (error) {
      throw new Error();
    } finally {
      // set user state to an empty User object
      // set userToken state to an empty string
      // remove "access_token" from request's authorization header
      // set isLoggingOut to false

      setUser({} as User);
      setUserToken("");
      delete api.defaults.headers.common["Authorization"];
      setIsLoggingOut(false);
    }
  }

  useEffect(() => {
    // add client_id to request's "Client-Id" header
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggingOut, isLoggingIn, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };