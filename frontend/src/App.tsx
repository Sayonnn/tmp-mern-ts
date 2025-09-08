import { Routes, Route } from "react-router-dom";
import ClientRoutes from "./routes/ClientRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import useAppContext from "./hooks/useApp";

function App() {
  const { configs } = useAppContext();
  return (
    <Routes>
        {/* add toast here for notifications */}
        
        {/* Public/Client-facing */}
        <Route path="/*" element={<ClientRoutes />} />

        {/* Admin */}
        <Route path={`/${configs.appName}-admin/*`} element={<AdminRoutes />} />
    </Routes>
  );
}

export default App;
