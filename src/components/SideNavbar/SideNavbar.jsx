import SideCategory from "./SideCategory/SideCategory";
import classes from "./SideNavbar.module.css";

export default function SideNavbar({
  changeSecondSidebarData,
  sidebarClass,
  handleSecondSideBarClassChange,
}) {
  return (
    <div className={`${classes.navbar} ${sidebarClass}`}>
      <SideCategory
        changeSecondSidebarData={changeSecondSidebarData}
        toggleSecond={handleSecondSideBarClassChange}
        isExpanded={sidebarClass == "" ? false : true}
        icon={"/apps.svg"}
        title={"Users"}
        listItems={[
          { label: "One", link: "One" },
          { label: "Two", link: "Two" },
          { label: "Three", link: "Three" },
        ]}
      />
    </div>
  );
}
