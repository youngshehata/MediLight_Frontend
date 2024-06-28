import { useState } from "react";
import classes from "./SecondSideBar.module.css";
import { useNavigate } from "react-router-dom";

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

  return (
    <div
      className={
        isExpanded
          ? `${classes.main} secondSideExpanded ${
              isPinned ? "secondSidePinned" : ""
            }`
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
              className={`${classes.li}`}
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
