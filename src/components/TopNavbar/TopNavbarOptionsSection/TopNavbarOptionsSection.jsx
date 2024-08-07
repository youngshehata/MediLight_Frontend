import { useContext } from "react";
import { language } from "../../../utilities/language";
import classes from "../TopNavbar.module.css";
import ProfileSection from "./ProfileSection/ProfileSection";
import { LanguageContext } from "../../../App";
import AppsList from "./AppsList/AppsList";
import Messages from "./Messages/Messages";
import Notifications from "./Notifications/Notifications";

export default function TopNavbarOptionsSection({
  changeLanguage,
  changeAuth,
}) {
  const currentLanguage = useContext(LanguageContext);

  return (
    <div className={`${classes.optionsSection}`}>
      <Notifications />
      <Messages />
      <AppsList />
      <span
        className={`${classes.languageSpan}`}
        onClick={() => {
          currentLanguage == "ar" ? changeLanguage("en") : changeLanguage("ar");
        }}
      >
        {currentLanguage == "ar"
          ? language.languageLetter.en
          : language.languageLetter.ar}
      </span>
      <ProfileSection changeAuth={changeAuth} />
    </div>
  );
}
