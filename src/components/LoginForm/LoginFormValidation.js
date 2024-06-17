import toast from "react-hot-toast";
import { language } from "../../language";

const currentLanguage = localStorage.getItem("lang") || "en";

export const validation_login = (username, password) => {
  if (!username || !password) {
    toast.error(language.usernameAndPassword[currentLanguage]);
    return false;
  }
  //? you can add other validations such as username min length
  // if(username && username.toString().length < 2){
  //     toast.error(language.usernameAndPassword) // create language for too short username
  //     return false
  // }

  return true;
};
