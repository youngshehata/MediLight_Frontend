import { useContext, useState } from "react";
import { language } from "../../utilities/language";
import classes from "./Permissions.module.css";
import { LanguageContext } from "../../App";
import UsersList from "../../components/UsersList/UsersList";
import PermissionsEntities from "./PermissionsEntities";

export default function PermissonsModify() {
  const currentLanguage = useContext(LanguageContext);

  //! States
  const [activeMode, setActiveMode] = useState("grant");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [recivers, setRecivers] = useState({ type: "users", list: [] });

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

  const switchReciversType = (type) => {
    if (type == "users" && recivers.type != "users") {
      setRecivers({ ...recivers, type: "users" });
    } else if (type == "groups" && recivers.type != "groups") {
      setRecivers({ ...recivers, type: "groups" });
    }
  };

  return (
    <div className={classes.pmContainer}>
      {/* -------------- Permissions List  --------------------*/}
      <div className={classes.permissionsList}>P.List</div>
      {/* -------------- MODE (GRANT || REMOVE)  --------------------*/}
      <div className={classes.modeContainer}>
        <span>{language.mode[currentLanguage]}</span>
        <section className={classes.buttonsSection}>
          <button
            onClick={activateGrant}
            className={
              activeMode == "grant"
                ? `${classes.modeButton} ${
                    classes[`grantButton_${currentLanguage}`]
                  } ${classes.activeButton}`
                : `${classes.modeButton} ${
                    classes[`grantButton_${currentLanguage}`]
                  }`
            }
          >
            {language.grant[currentLanguage]}
          </button>
          <button
            onClick={activateRemove}
            className={
              activeMode == "remove"
                ? `${classes.modeButton} ${
                    classes[`removeButton_${currentLanguage}`]
                  } ${classes.activeButton}`
                : `${classes.modeButton} ${
                    classes[`removeButton_${currentLanguage}`]
                  }`
            }
          >
            {language.remove[currentLanguage]}
          </button>
        </section>
      </div>
      {/* -------------- Recivers (Users || Groups)  --------------------*/}
      <div className={classes.reciversContainer}>
        <div className={classes.reciversTitle}>
          <span>{language.entities[currentLanguage]}</span>
          <span className={classes.reciversTypeSpan}>{`(${
            recivers.type == "users"
              ? language.users[currentLanguage]
              : language.groups[currentLanguage]
          })`}</span>
        </div>
        <section className={classes.typeSection}>
          <button
            onClick={() => {
              switchReciversType("users");
            }}
            className={`${classes.typeButton} ${
              recivers.type == "users" ? `${classes["typeButton_active"]}` : ""
            }`}
          >
            {language.users[currentLanguage]}
          </button>
          <button
            onClick={() => {
              switchReciversType("groups");
            }}
            className={`${classes.typeButton} ${
              recivers.type == "groups" ? `${classes["typeButton_active"]}` : ""
            }`}
          >
            {language.groups[currentLanguage]}
          </button>
        </section>
        <PermissionsEntities
          list={[
            { id: 1, labelEn: "Shehata", labelAr: "شحاته", selected: false },
            { id: 2, labelEn: "Omar", labelAr: "عمر", selected: true },
            { id: 3, labelEn: "Laila", labelAr: "ليلى", selected: false },
          ]}
        />
      </div>
      {/* -------------- Footer --------------------*/}
      <div className={classes.footerContainer}>
        <span
          className={classes.greenSpan}
        >{`(${selectedPermissions.length})`}</span>
        <span>
          {activeMode == "grant"
            ? language.permissionFooterGrant[currentLanguage]
            : language.permissionFooterRemove[currentLanguage]}
        </span>
        <span
          className={classes.greenSpan}
        >{`(${recivers.list.length}) `}</span>
        <span>
          {recivers.type == "users"
            ? language.user[currentLanguage]
            : language.group[currentLanguage]}
        </span>
        <button
          className={`${classes.submitPermissionsButton} ${
            classes[`submitPermissionsButton_${activeMode}`]
          }`}
        >
          {activeMode == "grant"
            ? language.grantPermissions[currentLanguage]
            : language.removePermissions[currentLanguage]}
        </button>
      </div>
    </div>
  );
}
