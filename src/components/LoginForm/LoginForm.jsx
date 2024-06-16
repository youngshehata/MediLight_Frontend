import { useContext, useState } from "react";
import classes from "./LoginForm.module.css";
import { LanguageContext } from "../../App";
import { language } from "../../language";
import Button from "../Button";
import Loading from "../Loading/Loading";

export default function LoginForm() {
  const currentLanguage = useContext(LanguageContext);

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

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
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
