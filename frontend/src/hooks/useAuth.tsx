import { useState } from "react";
import type { loginProcessArgsProps, loginProcessResponseProps } from "../interfaces/authInterface";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("authToken")
  );

  const login = ({ username, password, role }: loginProcessArgsProps): loginProcessResponseProps => {
    if (!username) return { status: false, message: "Username is required" };
    if (!password) return { status: false, message: "Password is required" };

    // Simulate role-based login
    const allowedRoles = ["admin", "client"];
    if (allowedRoles.includes(role)) {
      localStorage.setItem("authToken", "fake-jwt-token");
      setIsAuthenticated(true);
      return { status: true, message: "Login successful" };
    }

    // fallback for invalid role
    setIsAuthenticated(false);
    return { status: false, message: "Login failed" };
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}
