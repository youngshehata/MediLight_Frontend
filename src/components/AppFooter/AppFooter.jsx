import { useContext } from "react";
import { language } from "../../language";
import classes from "./AppFooter.module.css";
import { LanguageContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { footerLinks } from "./footerLinks";

export default function AppFooter() {
  const navigate = useNavigate();
  const currentLanguage = useContext(LanguageContext);

  const socialMediaLinks = footerLinks;

  return (
    <div className={`${classes.footer} flexCenterRow`}>
      <span>{language.allRightsReserved[currentLanguage]}</span>
      <img
        src="/dmsLogo.png"
        alt="logo"
        className={`${classes.logo}`}
        onClick={() => {
          window.open("https://dmsegypt.net/web/");
        }}
      />
      <div className={`${classes.iconsContainer} flexCenterRow`}>
        <span className={`${classes.borderSpan}`}></span>
        {socialMediaLinks.map((platform) => {
          return (
            <img
              key={platform.key}
              className={`${classes.icon}`}
              src={platform.icon}
              alt={platform.icon.replace(".svg", "")}
              onClick={() => {
                window.open(platform.link);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
