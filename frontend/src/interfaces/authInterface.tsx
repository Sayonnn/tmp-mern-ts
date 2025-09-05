export interface ProtectedRouteProps {
    isAuthenticated: boolean;
    children: React.ReactNode;
    role:string;
}
  
export interface loginProcessArgsProps {
    username: string;
    password: string;
    role: string;
}

export interface loginProcessResponseProps {
    field?: string;
    status: boolean;
    message: string;
}