import { Link, useNavigate } from "react-router-dom";
import classes from "../../TopNavbar.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { LanguageContext } from "../../../../App";
import { language } from "../../../../utilities/language";

export default function ProfileSection({ changeAuth }) {
  const [menuActive, setMenuActive] = useState(false);

  const currentLanguage = useContext(LanguageContext);

  const navigate = useNavigate();

  const dropDownContainer = useRef();

  const handleClickOutside = (event) => {
    if (
      dropDownContainer.current &&
      !dropDownContainer.current.contains(event.target)
    ) {
      setMenuActive(false);
    }
  };

  const logoutFunction = () => {
    changeAuth(null);
    sessionStorage.removeItem("access");
    navigate("/");
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    // Cleanup function to remove listener on component unmount
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  return (
    <div
      ref={dropDownContainer}
      className={`${classes.profileSection} flexCenterRow`}
    >
      <div
        onClick={() => {
          setMenuActive(!menuActive);
        }}
        className="flexCenterRow"
      >
        <img className={`${classes.userImage}`} src="/user.jpg" alt="user" />
        <span className={`${classes.userText}`}>Islam Ali</span>
        <img
          className={`${classes.expandArrow}`}
          src="/downArrow.svg"
          alt="expand"
        />
      </div>
      <ul
        onClick={() => {
          setMenuActive(false);
        }}
        className={
          menuActive
            ? `${classes.profileList} flexCenterColumn topBarList ${classes.profileListActive}`
            : `${classes.profileList} flexCenterColumn topBarList`
        }
      >
        <Link to={"/medilight/profile"}>
          {language.editProfile[currentLanguage]}
        </Link>
        <Link to={"/medilight/settings"}>
          {language.settings[currentLanguage]}
        </Link>
        <li
          onClick={() => {
            logoutFunction();
          }}
        >
          {language.logout[currentLanguage]}
        </li>
      </ul>
    </div>
  );
}
