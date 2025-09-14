import { createContext, useEffect, useState } from "react";
import type { AuthContextProps, DecodedToken, loginProcessArgsProps } from "../interfaces/authInterface";
import { setStorage, removeStorage, getStorage } from "../utils/storage.handler";
import { jwtDecode } from "jwt-decode";
import type { User } from "../interfaces/userInterface";
import ClientService from "../services/api.service";
import AdminService from "../admin/services/api.service";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
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
    let res;

    if (role === "admin") {
      res = await AdminService.auth.login({ username, password });
    } else {
      res = await ClientService.auth.login({ username, password });
    }

    setStorage("authToken", res.accessToken);
    setAccessToken(res.accessToken);
    setIsAuthenticated(true);
    setUser(res.user);

    return { status: true, message: res.message };
  } catch (error: any) {
    return { status: false, message: error.message || "Login failed", field: error.field };
  }
};

/** 🔄 Refresh User Data */
const refreshData = async (role: string) => {
  setLoadingUser(true);
  try {
    let res;

    if (role === "admin") {
      res = await AdminService.auth.refreshInformation();
    } else {
      res = await ClientService.auth.refreshInformation();
    }

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
  const logout = async () => {
    try {
      if (user?.role === "admin") {
        await AdminService.auth.logout();
      } else {
        await ClientService.auth.logout();
      }
    } catch (err) {
      console.warn("Logout API failed, proceeding to clear local state anyway:", err);
    } finally {
      removeStorage("authToken");
      setAccessToken(null);
      setIsAuthenticated(false);
      setUser(null);
    }
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
