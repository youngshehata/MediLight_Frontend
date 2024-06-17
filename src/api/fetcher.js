import axios from "axios";
import toast from "react-hot-toast";
import { language } from "../language";

export const fetchFromApi = async (url, method, data) => {
  const currentLanguage = localStorage.getItem("lang") || "en";

  // skip the host name and just provide the endpoint like (branches/create) and it will be added on the line below,
  // to avoid importing the API_KEY everywhere we fetch data
  url = import.meta.env.VITE_API_KEY + url;
  try {
    let response;
    switch (method) {
      case "GET":
        response = await axios.get(url);
        break;
      case "POST":
        response = await axios.post(url, data);
        break;
      case "PATCH":
        response = await axios.patch(url, data);
        break;
      case "DELETE":
        response = await axios.delete(url, data);
        break;
      case "PUT":
        response = await axios.put(url, data);
        break;
    }
    if (response.data) {
      return response;
    }
  } catch (err) {
    // the following checking because maybe an endpoint does not have a reply message, or the developer accidentally gave it null,
    // we dont wanna the client to get empty toast message
    let errorMessage = err.response?.data?.message;
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.error(language.internalError[currentLanguage]);
    }
    throw err;
  }
};
