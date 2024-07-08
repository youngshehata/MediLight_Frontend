import toast from "react-hot-toast";
import { language } from "./language";

export function handleErrors(err) {
  try {
    // let errorObjectName = Object.keys(err.response.data.errors)[0];
    // return toast.error(err.response?.data?.errors[errorObjectName][0]);
    if (err.response?.data?.message) {
      return toast.error(err.response?.data?.message);
    } else if (err.response?.data?.Message) {
      return toast.error(err.response?.data?.Message);
    }
  } catch (error) {
    let lang = localStorage.getItem("lang") || "en";
    return toast.error(language.internalError[lang]);
  }
}
