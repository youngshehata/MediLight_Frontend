import { useContext } from "react";
import SideCategory from "./SideCategory/SideCategory";
import classes from "./SideNavbar.module.css";
import { LanguageContext } from "../../App";
import { language } from "../../utilities/language";
import Auth from "../Auth/Auth";

export default function SideNavbar({
  changeSecondSidebarData,
  sidebarClass,
  handleSecondSideBarClassChange,
}) {
  const currentLanguage = useContext(LanguageContext);
  return (
    <div className={`${classes.navbar} ${sidebarClass}`}>
      <Auth
        authRole={"client"}
        componentJSX={
          <SideCategory
            changeSecondSidebarData={changeSecondSidebarData}
            toggleSecond={handleSecondSideBarClassChange}
            isExpanded={sidebarClass == "" ? false : true}
            icon={"/clientApps.svg"}
            title={language.client[currentLanguage]}
            listItems={[
              {
                label: { en: "Organizations", ar: "المنظمات" }[currentLanguage],
                link: "client/organization",
              },
            ]}
          />
        }
      />
      <Auth
        authRole={"admin"}
        componentJSX={
          <SideCategory
            changeSecondSidebarData={changeSecondSidebarData}
            toggleSecond={handleSecondSideBarClassChange}
            isExpanded={sidebarClass == "" ? false : true}
            icon={"/usersManage.svg"}
            title={language.administration[currentLanguage]}
            listItems={[
              {
                label: { en: "Users Management", ar: "إدارة المستخدمين" }[
                  currentLanguage
                ],
                link: "admin/users",
              },
              {
                label: { en: "Users Groups", ar: "إدارة المجموعات" }[
                  currentLanguage
                ],
                link: "admin/groups",
              },
            ]}
          />
        }
      />
    </div>
  );
}
