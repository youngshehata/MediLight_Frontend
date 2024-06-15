import { useContext } from "react";
import classes from "./Fallback.module.css";
import { LanguageContext } from "../../App";
import { language } from "../../language";
import Button from "../../components/Button";

export default function Fallback() {
  const currentLanguage = useContext(LanguageContext);

  return (
    <div className={`${classes.container} flexCenterColumn`}>
      <img className={`${classes.img}`} src="/fallback.svg" alt="Error" />
      <p className={`${classes.text}`}>{language.fallback[currentLanguage]}</p>
      <Button
        cssClass={`${classes.button} buttonTranslateHover`}
        text={language.reload[currentLanguage]}
        onClickFunction={() => {
          document.location.replace("/");
        }}
      ></Button>
    </div>
  );
}
