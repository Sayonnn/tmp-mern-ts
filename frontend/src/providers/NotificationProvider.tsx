import { createContext, type ReactNode } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { NotificationContextProps,ToastType } from "../interfaces/notificationInterface";

export const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children } : { children: ReactNode }) => {
  const notify = (message: string, type: ToastType = "info") => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      default:
        toast.info(message);
    }
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      <ToastContainer position="top-right" autoClose={3000} />
      {children}
    </NotificationContext.Provider>
  );
};

