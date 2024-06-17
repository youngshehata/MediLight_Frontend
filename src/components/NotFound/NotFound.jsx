import { useContext } from "react";
import { language } from "../../language";
import { LanguageContext } from "../../App";
import classes from "./NotFound.module.css";

const NotFound = () => {
  const currentLanguage = useContext(LanguageContext);

  return (
    <article className={`${classes.notFoundContainer} flexCenterColumn`}>
      <img
        src="/notFound.svg"
        alt="missing"
        className={`${classes.notFoundImg}`}
      />
      <span className={`${classes.notFoundText}`}>
        {language.invalidUrl[currentLanguage]}
      </span>
    </article>
  );
};

export default NotFound;
