import { useContext, useState } from "react";
import { language } from "../../utilities/language";
import classes from "./Permissions.module.css";
import { LanguageContext } from "../../App";

export default function PermissonsModify() {
  const currentLanguage = useContext(LanguageContext);

  //! States
  const [activeMode, setActiveMode] = useState("grant");

  //! Handlers
  const activateGrant = () => {
    if (activeMode !== "grant") {
      setActiveMode("grant");
    }
  };
  const activateRemove = () => {
    if (activeMode !== "remove") {
      setActiveMode("remove");
    }
  };

  return (
    <div className={classes.pmContainer}>
      <div className={classes.permissionsList}>P.List</div>
      <div className={classes.modeContainer}>
        <span>{language.mode[currentLanguage]}</span>
        <section className={classes.buttonsSection}>
          <button
            onClick={activateGrant}
            className={
              activeMode == "grant"
                ? `${classes.modeButton} ${classes.grantButton} ${classes.activeButton}`
                : `${classes.modeButton} ${classes.grantButton}`
            }
          >
            {language.grant[currentLanguage]}
          </button>
          <button
            onClick={activateRemove}
            className={
              activeMode == "remove"
                ? `${classes.modeButton} ${classes.removeButton} ${classes.activeButton}`
                : `${classes.modeButton} ${classes.removeButton}`
            }
          >
            {language.remove[currentLanguage]}
          </button>
        </section>
      </div>
      <div>Recivers</div>
      <div>footer</div>
    </div>
  );
}
