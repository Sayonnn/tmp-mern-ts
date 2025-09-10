import { Routes, Route } from "react-router-dom";
import Login from "../admin/pages/auth/Login";
import Dashboard from "../admin/pages/Dashboard";
import ProtectedRoute from "../middlewares/ProtectedRoute";
import NotFound from "../pages/NotFound";
import useAuthContext from "../hooks/useAuth";

function AdminRoutes() {
  const { isAuthenticated } = useAuthContext();

  return (
    <Routes>
      <Route path="" element={<Login />} />

      <Route
        path="dashboard"  
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} role="admin">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all for unmatched client routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AdminRoutes;
