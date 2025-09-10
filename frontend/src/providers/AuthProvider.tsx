import { createContext, useEffect, useState } from "react";
import type { AuthContextProps, DecodedToken, loginProcessArgsProps } from "../interfaces/authInterface";
import { postDatas } from "../services/api.service";
import { setStorage, removeStorage, getStorage } from "../utils/storage.handler";
import { jwtDecode } from "jwt-decode";
import type { User } from "../interfaces/userInterface";
import useAppContext from "../hooks/useApp";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const { configs } = useAppContext();
  const [user, setUser] = useState<User | null>(null);
  const [_, setLoadingUser] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getStorage("authToken");
  
        if (token) {
          const decoded: DecodedToken = jwtDecode(token);
          const now = Date.now() / 1000;
          if (decoded.exp > now) {
            setAccessToken(token);
            setIsAuthenticated(true);
          
            setUser({
              id: decoded.id,
              email: decoded.email,
              username: decoded.username,
              role: decoded.role,
              created_at: decoded.created_at,
              permissions: decoded.permissions || [],
              super_admin: decoded.super_admin || false,
            });
          
            await refreshData(decoded.role);
          }
          else {
            logout();
          }
        }
      } catch (err) {
        console.error("Initialize auth failed:", err);
        logout();
      } finally {
        setInitialized(true);
      }
    };
  
    initializeAuth();
  }, []);
  
  /** Login */
  const login = async ({ username, password, role }: loginProcessArgsProps) => {
    if (!username || !password) {
      return { status: false, message: "Username or password missing" };
    }

    try {
      const response = await postDatas({
        url: role === "admin" ? `/${configs.appName}-admin/auth/login` : "/auth/login",
        data: { username, password },
      });

      setStorage("authToken", response.accessToken);
      setAccessToken(response.accessToken);
      setIsAuthenticated(true);
      setUser(response.user);

      return { status: true, message: response.message };
    } catch (error: any) {
      return { status: false, message: error.message || "Login failed", field: error.field };
    }
  };

  /** 🔄 Refresh User Data */
  const refreshData = async (role: string) => {
    setLoadingUser(true);
    try {
      const res = await postDatas({
        url: role === "admin"
          ? `/${configs.appName}-admin/auth/refresh-admin-information`
          : "/auth/refresh-client-information"
      });
  
      if (res.user) {
        console.log("Refreshed user data:", res);
        setUser(res.user);
        return res.user;
      }
    } catch (err: any) {
      console.warn("Access token invalid or expired:", err);
      logout();
      return null;
    } finally {
      setLoadingUser(false);
    }
  };

  /** 🚪 Logout */
  const logout = () => {
    removeStorage("authToken");
    setAccessToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!initialized) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, accessToken, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
