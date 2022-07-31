import { createContext, ReactNode, useEffect, useState } from "react";

import { setCookie, parseCookies } from "nookies";

import Router from "next/router";
import { api } from "../services/api";

interface AuthProviderProps {
  children: ReactNode;
}

type signInCredentials = {
  email: string;
  password: string;
};
type AuthContextData = {
  signIn(credentials: signInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user?: User;
};
type User = {
  email: string;
  permissions: string[];
  roles: string;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      api.get("/me").then((response) => {
        const { email, permissions, roles } = response.data;

        setUser({ email, permissions, roles });
      });
    }
  }, []);

  async function signIn({ email, password }: signInCredentials) {
    try {
      const response = await api.post("sessions", {
        email,
        password,
      });

      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: "/", //qualquer endereço da aplicação
      });

      setCookie(undefined, "nextauth.resfreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: "/", //qualquer endereço da aplicação
      });

      setUser({
        email,
        permissions,
        roles,
      });

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
