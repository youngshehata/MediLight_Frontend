import { useContext, useState } from "react";
import classes from "./SecondSideBar.module.css";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../App";

export default function SecondSideBar({
  title,
  items,
  isExpanded,
  isPinned,
  pinSecondSidebar,
  clickOutsideSecondSidebar,
}) {
  const [pinnedClass, setPinnedClass] = useState(`${classes.pinImg}`);

  const navigate = useNavigate();

  const currentLanguage = useContext(LanguageContext);

  return (
    <div
      className={
        isExpanded
          ? `${classes.main} ${
              currentLanguage == "ar"
                ? "secondSideExpandedAr"
                : "secondSideExpanded"
            } ${isPinned ? "secondSidePinned" : ""}`
          : `${classes.main} secondSideCollapsed ${
              isPinned ? "secondSidePinned" : ""
            }`
      }
    >
      <img
        onClick={() => {
          pinnedClass.includes("pinnedImg")
            ? setPinnedClass(`${classes.pinImg}`)
            : setPinnedClass(`${classes.pinImg} pinnedImg`);
          pinSecondSidebar();
        }}
        className={pinnedClass}
        src="/pin.svg"
        alt="pin"
      />
      <span className={`${classes.title}`}>{title}</span>
      <ul className={`${classes.ul}`}>
        {items.map((i, index) => {
          return (
            <li
              className={
                currentLanguage == "ar"
                  ? `${classes.li} ${classes.liAr}`
                  : `${classes.li}`
              }
              key={index + 1}
              onClick={() => {
                clickOutsideSecondSidebar();
                navigate(i.link);
              }}
            >
              {i.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
