import { toast, ToastContent } from "react-toastify";
import { ToastType } from "@/types";

export const notify = (message: ToastContent, type: ToastType) => {
  return toast[type](message);
};
