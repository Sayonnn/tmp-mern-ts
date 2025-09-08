import { createContext } from "react";
import type { AppContextValue,AppConfig, AppProviderProps } from "../interfaces/globalInterface";

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: AppProviderProps) {
  const configs: AppConfig = {
    appName: import.meta.env.VITE_APP_NAME,
    appCoolName: import.meta.env.VITE_APP_COOL_NAME,
    appDescription: import.meta.env.VITE_APP_DESCRIPTION,
  };

  return (
    <AppContext.Provider value={{ configs }}>
      {children}
    </AppContext.Provider>
  );
}
