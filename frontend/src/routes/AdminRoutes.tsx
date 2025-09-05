import { Routes, Route } from "react-router-dom";
import Login from "../admin/pages/Login";
import Dashboard from "../admin/pages/Dashboard";
import ProtectedRoute from "../middlewares/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";
import NotFound from "../pages/NotFound";

function AdminRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* When user goes to /upguard-admin, show Login */}
      <Route path="" element={<Login />} />

      {/* Protected Dashboard (full path: /upguard-admin/dashboard) */}
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
