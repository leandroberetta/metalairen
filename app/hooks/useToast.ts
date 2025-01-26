// hooks/useToast.ts
import { useState } from "react";

type ToastState = {
  message: string;
  type: "success" | "error" | "warning" | "info";
  visible: boolean;
};

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "success",
    visible: false,
  });

  const showToast = (message: string, type: ToastState["type"] = "success") => {
    setToast({ message, type, visible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return { toast, showToast, hideToast };
}
