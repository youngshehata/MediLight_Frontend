import { useContext, useEffect, useRef, useState } from "react";
import classes from "./AppsList.module.css";
import { listOfApps } from "./listOfApps";
import { LanguageContext } from "../../../../App";
import { useNavigate } from "react-router-dom";
import Button from "../../../Button";
import { language } from "../../../../language";

export default function AppsList() {
  const [menuActive, setMenuActive] = useState("");

  const navigate = useNavigate();

  const currentLanguage = useContext(LanguageContext);

  const dropDownContainer = useRef(null);

  const toggleTheMenu = () => {
    menuActive == ""
      ? setMenuActive(`${classes.listActive}`)
      : setMenuActive("");
  };

  const handleClickOutside = (event) => {
    if (
      dropDownContainer.current &&
      !dropDownContainer.current.contains(event.target)
    ) {
      setMenuActive(false);
    }
  };

  const mainMenuButtonClick = () => {
    navigate("mainmenu");
    setMenuActive("");
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    // Cleanup function to remove listener on component unmount
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropDownContainer}
      className={`${classes.container} flexCenterColumn`}
    >
      <img
        onClick={() => {
          toggleTheMenu();
        }}
        className={`${classes.img}`}
        src="/apps.svg"
        alt="apps"
      />
      <div className={`${classes.list} topBarList ${menuActive}`}>
        <ul className={`${classes.ul}`}>
          {listOfApps.map((app) => {
            return (
              <li
                onClick={() => {
                  navigate(app.link);
                  setMenuActive("");
                }}
                className={`${classes.li}`}
              >
                <img src={app.icon} alt={app.icon.replace(".png", "")} />
                <span>{app.label[currentLanguage]}</span>
              </li>
            );
          })}
          <Button
            cssClass={`${classes.button} gridAllColumns`}
            text={language.mainMenu[currentLanguage]}
            onClickFunction={mainMenuButtonClick}
          />
        </ul>
      </div>
    </div>
  );
}
