import toast from "react-hot-toast";
import { language } from "./language";

export function handleErrors(err) {
  try {
    let errorObjectName = Object.keys(err.response.data.errors)[0];
    return toast.error(err.response?.data?.errors[errorObjectName][0]);
  } catch (error) {
    let lang = localStorage.getItem("lang") || "en";
    return toast.error(language.internalError[lang]);
  }
}
