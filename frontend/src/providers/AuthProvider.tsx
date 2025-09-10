// AuthContext.tsx
import { createContext, useEffect, useState } from "react";
import type { AuthContextProps, DecodedToken, loginProcessArgsProps, loginProcessResponseProps } from "../interfaces/authInterface";
import { postDatas } from "../services/api.service";
import { setStorage, removeStorage, getStorage } from "../utils/storage.handler";
import { jwtDecode } from "jwt-decode";
import type { User } from "../interfaces/userInterface";
import useAppContext from "../hooks/useApp";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const { configs } = useAppContext();
  const [user, setUser] = useState<User | null>(null); 

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getStorage("authToken"); /** valid 15 minutes */
        const storedUser = getStorage("authUser"); /** should be removed */
   
        if (token) {
          try {
            const decoded: DecodedToken = jwtDecode(token);
            const now = Date.now() / 1000;
  
            if (decoded.exp > now) {
              // Token still valid
              setAccessToken(token);
              setIsAuthenticated(true);
  
              if (storedUser) {
                setUser(JSON.parse(storedUser));
              } else {
                const newUser = {
                  email: decoded.email,
                  role: decoded.role,
                  username: decoded.username,
                };
                setUser(newUser);
                setStorage("authUser", JSON.stringify(newUser)); /** should be removed */
              }
            } else {
              // Token expired → refresh
              const response = await postDatas({ url: "/auth/refresh-access-token" });
  
              if (!response?.data) {
                logout();
              } else {
                setStorage("authToken", response.data.accessToken); 
                setStorage("authUser", JSON.stringify(response.data.user)); /** should be removed */
                setAccessToken(response.data.accessToken);
                setIsAuthenticated(true);
                setUser(response.data.user);
              }
            }
          } catch (error: any) {
            console.error("Token decode or refresh failed:", error);
            logout();
          }
        }
      } catch (error) {
        console.error("Initialize auth failed:", error);
        logout();
      } finally {
        setInitialized(true); 
      }
    };
  
    initializeAuth();
  }, []);
  

  /**
   * Login Process | Authentication Global Provider
   * @param param0 loginProcessArgsProps
   * @returns loginProcessResponseProps
   */
  const login = async ({ username, password, role }: loginProcessArgsProps) => {
    if (!username || !password)
      return { status: false, message: "Username or password missing" } as loginProcessResponseProps;

    try {
      const response = await postDatas({
        url: role === "admin" ? `/${configs.appName}-admin/auth/login` : "/auth/login",
        data: { username, password }, 
      });

      setStorage("authToken", response.accessToken); 
      setStorage("authUser", JSON.stringify(response.user)); /** should be removed */
      setAccessToken(response.accessToken);
      setIsAuthenticated(true);
      setUser(response.user);

      return { status: true, message: response.message };
    } catch (error: any) {
      return { status: false, message: error.message || "Login failed",field:error.field };
    }
  };

  /** Refresh Data Process | Authentication Global Provider */
  const refreshData = async (role:string) => {
    try {
      
    } catch (error) {
      
    }
  }

  /**
   * Logout Process | Authentication Global Provider
   */
  const logout = () => {
    removeStorage("authToken"); 
    removeStorage("authUser"); /** should be removed */
    setAccessToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!initialized) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };