import { useContext, useState } from "react";
import classes from "./LoginForm.module.css";
import { LanguageContext } from "../../App";
import { language } from "../../utilities/language";
import Button from "../Button";
import Loading from "../Loading/Loading";
import { validation_login } from "./LoginFormValidation";
import { fetchFromApi } from "../../api/fetcher";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleErrors } from "../../utilities/errors";
import { decodeJWT_Roles } from "../../utilities/auth";

export default function LoginForm({ changeAuth }) {
  const currentLanguage = useContext(LanguageContext);

  const navigate = useNavigate();

  // States for inputs changing
  const [usernameInput, setUsernameInput] = useState(null);
  const [passwordInput, setPasswordInput] = useState(null);
  // Loading state
  const [loading, setLoading] = useState(false);

  // Handling events functions
  const handleFocus = (e) => {
    e.target.classList.add(`${classes.inputFocused}`);
    e.target.classList.remove(`${classes.inputBlured}`);
  };

  const handleBlur = (e) => {
    e.target.classList.add(`${classes.inputBlured}`);
    e.target.classList.remove(`${classes.inputFocused}`);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const isValid = validation_login(usernameInput, passwordInput);
    if (!isValid) {
      setLoading(false);
      return;
    }

    fetchFromApi(`V1/Authentication/SignIn`, "POST", {
      userName: usernameInput,
      password: passwordInput,
    })
      .then((response) => {
        let roles = decodeJWT_Roles(response.data.data.acces_token);
        changeAuth(
          {
            username: response.data.data.userName,
            id: response.data.data.id,
          },
          roles
        );
        // Setting default header auth
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.data.acces_token}`;
        sessionStorage.setItem("access", response.data.data.acces_token);
        // ****************************
        setLoading(false);
        navigate("medilight");
      })
      .catch((err) => {
        setLoading(false);
        handleErrors(err);
      });
  };

  return (
    <>
      {loading ? <Loading /> : null}
      <form
        className={`${classes.form} flexCenterColumn lang_${currentLanguage}`}
      >
        <label className={`${classes.label}`} htmlFor="username">
          {language.username[currentLanguage]}
        </label>
        <input
          onFocus={(e) => handleFocus(e)}
          onBlur={(e) => handleBlur(e)}
          onChange={(e) => {
            setUsernameInput(e.target.value);
          }}
          className={`${classes.input}`}
          id="username"
          type="text"
        />
        <label className={`${classes.label}`} htmlFor="password">
          {language.password[currentLanguage]}
        </label>
        <input
          onFocus={(e) => handleFocus(e)}
          onBlur={(e) => handleBlur(e)}
          onChange={(e) => {
            setPasswordInput(e.target.value);
          }}
          className={`${classes.input}`}
          id="password"
          type="password"
        />
        <Button
          cssClass={`${classes.button} buttonTranslateHover`}
          text={language.login[currentLanguage]}
          onClickFunction={handleSubmit}
        />
      </form>
    </>
  );
}
