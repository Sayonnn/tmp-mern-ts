import { Routes, Route } from "react-router-dom";
import ClientRoutes from "./routes/ClientRoutes";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <Routes>
        {/* add toast here for notifications */}
        
        {/* Public/Client-facing */}
        <Route path="/*" element={<ClientRoutes />} />

        {/* Admin */}
        <Route path="/upguard-admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}

export default App;
