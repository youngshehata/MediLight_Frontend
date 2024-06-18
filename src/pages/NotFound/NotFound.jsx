import { useContext } from "react";
import { language } from "../../language";
import { LanguageContext } from "../../App";
import classes from "./NotFound.module.css";
import { Link } from "react-router-dom";

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
      <Link className={`${classes.homepageLink} buttonTranslateHover`} to={"/"}>
        {language.homePage[currentLanguage]}
      </Link>
    </article>
  );
};

export default NotFound;
