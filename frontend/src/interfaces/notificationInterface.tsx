export type ToastType = "success" | "error" | "info" | "warning";

export interface NotificationContextProps {
  notify: (message: string, type?: ToastType) => void;
}
