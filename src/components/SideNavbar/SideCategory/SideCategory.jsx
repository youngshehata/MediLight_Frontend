import { useNavigate } from "react-router-dom";
import styles from "../SideNavbar.module.css";

export default function SideCategory({
  changeSecondSidebarData,
  icon,
  title,
  listItems,
  isExpanded,
  toggleSecond,
}) {
  const navigate = useNavigate();
  return (
    <div
      className={
        isExpanded
          ? `${styles.SideCategoryWide}`
          : `${styles.SideCategoryNarrow}`
      }
    >
      <img
        onClick={() => {
          changeSecondSidebarData(title, listItems);
          toggleSecond();
        }}
        className={`${styles.categoryImg}`}
        src={icon}
        alt="category"
      />
      {/* <div className={`${styles.nameAndList}`}>
        <span className={`${styles.categorygTitle}`}>{title}</span>
        <ul className={`${styles.categorygUl}`}>
          {listItems.map((i) => {
            return (
              <li
                onClick={() => {
                  navigate(i.link);
                }}
              >
                {i.label}
              </li>
            );
          })}
        </ul>
      </div> */}
    </div>
  );
}
