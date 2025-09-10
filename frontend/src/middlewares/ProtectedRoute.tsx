// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuth";
import type { ProtectedRouteProps } from "../interfaces/authInterface";
import useAppContext from "../hooks/useApp";

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthContext();
  const { configs } = useAppContext();

  // Not logged in → redirect
  if (!isAuthenticated) {
    return <Navigate to={role === "admin" ? `/${configs.appName}-admin` : "/"} />;
  }

  // Logged in but role does not match → redirect
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "admin" ? `/${configs.appName}-admin` : "/"} />;
  }

  // Authorized
  return <>{children}</>;
};

export default ProtectedRoute;
