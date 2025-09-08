export interface AppProviderProps {
    children: React.ReactNode
}
export interface AppConfig {
  appName: string;
  appCoolName: string;
  appDescription: string;
}

export interface AppContextValue {
  configs: AppConfig;
}

