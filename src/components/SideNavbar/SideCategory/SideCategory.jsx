import styles from "../SideNavbar.module.css";

export default function SideCategory({
  changeSecondSidebarData,
  icon,
  title,
  listItems,
  isExpanded,
  toggleSecond,
}) {
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
          toggleSecond(true);
        }}
        className={`${styles.categoryImg}`}
        src={icon}
        alt="category"
      />
    </div>
  );
}
