import { useContext } from "react";
import { footerList } from "./footerList";
import { LanguageContext } from "../../App";
import classes from "./Footer.module.css";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentLanguage = useContext(LanguageContext);
  const list = footerList;

  return (
    <footer
      className={`${classes.footer} flexCenterRow lang_${currentLanguage}`}
    >
      <ul className={`${classes.footerUL} flexCenterRow`}>
        {list.map((obj, index) => {
          return (
            <Link className={`${classes.footerLi}`} key={index} to={obj.link}>
              {currentLanguage == "ar" ? obj.ar : obj.en}
            </Link>
          );
        })}
      </ul>
    </footer>
  );
}
