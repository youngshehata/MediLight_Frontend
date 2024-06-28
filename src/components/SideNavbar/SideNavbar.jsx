import { useContext } from "react";
import SideCategory from "./SideCategory/SideCategory";
import classes from "./SideNavbar.module.css";
import { LanguageContext } from "../../App";
import { language } from "../../language";

export default function SideNavbar({
  changeSecondSidebarData,
  sidebarClass,
  handleSecondSideBarClassChange,
}) {
  const currentLanguage = useContext(LanguageContext);
  return (
    <div className={`${classes.navbar} ${sidebarClass}`}>
      <SideCategory
        changeSecondSidebarData={changeSecondSidebarData}
        toggleSecond={handleSecondSideBarClassChange}
        isExpanded={sidebarClass == "" ? false : true}
        icon={"/person.svg"}
        title={language.client[currentLanguage]}
        listItems={[
          {
            label: { en: "Add Organization", ar: "إضافة منظمة" }[
              currentLanguage
            ],
            link: "client/organization",
          },
        ]}
      />
    </div>
  );
}
