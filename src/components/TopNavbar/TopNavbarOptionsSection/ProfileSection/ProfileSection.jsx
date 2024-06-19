import { Link } from "react-router-dom";
import classes from "../../TopNavbar.module.css";
import { useEffect, useRef, useState } from "react";

export default function ProfileSection() {
  const [menuActive, setMenuActive] = useState(false);

  const dropDownContainer = useRef();

  const handleClickOutside = (event) => {
    if (
      dropDownContainer.current &&
      !dropDownContainer.current.contains(event.target)
    ) {
      setMenuActive(false);
    }
  };
  useEffect(() => {
    // Add event listener on document mount
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
        className={
          menuActive
            ? `${classes.profileList} ddl flexCenterColumn ${classes.profileListActive}`
            : `${classes.profileList} ddl flexCenterColumn`
        }
      >
        <Link to={"/profile"}>Edit Profile</Link>
        <Link to={"/settings"}>Settings</Link>
        <li>Logout</li>
      </ul>
    </div>
  );
}
