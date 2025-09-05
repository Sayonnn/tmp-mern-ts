import { Navigate } from "react-router-dom";
import type { ProtectedRouteProps } from "../interfaces/authInterface";

function ProtectedRoute({isAuthenticated,children,role}:ProtectedRouteProps){
  if(!isAuthenticated){
    if(role === "admin"){
      return <Navigate to="/upguard-admin" />;
    }
    return <Navigate to="/" />;
  }
  return children;
}

export default ProtectedRoute;