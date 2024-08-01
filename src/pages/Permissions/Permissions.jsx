import { useContext } from "react";
import classes from "./Permissions.module.css";
import { LanguageContext } from "../../App";
import { language } from "../../utilities/language";
import { useNavigate } from "react-router-dom";

export default function Permissions() {
  const currentLanguage = useContext(LanguageContext);
  const navigate = useNavigate();

  return (
    <div className="flexCenterColumn">
      <div className={classes.mainButtonsContainer}>
        <div
          className={`${classes.mainButton} buttonTranslateHover`}
          onClick={() => {
            navigate("data");
          }}
        >
          <span> {language.managePermissions[currentLanguage]}</span>
          <img src="/managePermissions.svg" alt="manage" />
        </div>
        <div
          onClick={() => {
            navigate("modify");
          }}
          className={`${classes.mainButton} buttonTranslateHover`}
        >
          <span>{language.grantOrRemovePermissions[currentLanguage]}</span>
          <img src="/grantPermissions.svg" alt="grantAndRemove" />
        </div>
      </div>
    </div>
  );
}
