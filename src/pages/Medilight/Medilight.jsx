// This component will be working as router to the whole app for authorized user

import { useContext, useEffect, useState } from "react";
import { AuthContext, LanguageContext } from "../../App";
import { Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import toast from "react-hot-toast";
import NotFound from "../NotFound/NotFound";
import { language } from "../../language";
import TopNavbar from "../../components/TopNavbar/TopNavbar";
import classes from "./Medilight.module.css";
import SideNavbar from "../../components/SideNavbar/SideNavbar";
import AppFooter from "../../components/AppFooter/AppFooter";
import ParamsWatcher from "../../components/ParamsWatcher/ParamsWatcher";
import SecondSideBar from "../../components/SecondSideBar/SecondSideBar";
import Client from "../Client/Client";

export default function Medilight({ changeLanguage, changeAuth }) {
  const navigate = useNavigate();

  const userInfo = useContext(AuthContext);

  const [secondSideBarData, setSecondSideBarData] = useState({
    title: "",
    items: [],
  });
  const currentLanguage = useContext(LanguageContext);

  const [secondSidebarPinned, setSecondSidebarPinned] = useState(false);

  // State for toggling the sidebar (State lifting)
  // These ( sideExpanded, secondSideExpanded ) class is defined on App.css , cuz its not module
  const [sidebarClass, setSidebarClass] = useState("");
  const [secondSidebarClass, setSecondSidebarClass] = useState("");
  const handleSideBarClassChange = () => {
    sidebarClass == "" ? setSidebarClass("sideExpanded") : setSidebarClass("");
  };
  const handleSecondSideBarClassChange = () => {
    secondSidebarClass == ""
      ? setSecondSidebarClass(
          `${
            currentLanguage == "ar"
              ? "secondSideExpanded secondSideExpandedAr"
              : "secondSideExpanded"
          }`
        )
      : setSecondSidebarClass("");
  };

  const changeSecondSidebarData = (title, items) => {
    setSecondSideBarData({ title, items });
  };
  const pinSecondSidebar = () => {
    setSecondSidebarPinned(!secondSidebarPinned);
  };

  const clickOutsideSecondSidebar = () => {
    if (!secondSidebarPinned) {
      setSecondSidebarClass("");
    }
  };

  useEffect(() => {
    // Unauthorized checking
    if (!userInfo) {
      toast.error(language.unauthorized[currentLanguage]);
      return navigate("/");
    }
  }, []);

  return (
    <div className={`${classes.medilight}`}>
      <TopNavbar
        changeLanguage={changeLanguage}
        changeAuth={changeAuth}
        handleSideBarClassChange={handleSideBarClassChange}
      />
      <div className={`${classes.navAndMain}`}>
        {/*side bars and main are contained together for dynamic width */}
        <SideNavbar
          changeSecondSidebarData={changeSecondSidebarData}
          sidebarClass={sidebarClass}
          handleSecondSideBarClassChange={handleSecondSideBarClassChange}
        />
        <SecondSideBar
          clickOutsideSecondSidebar={clickOutsideSecondSidebar}
          pinSecondSidebar={pinSecondSidebar}
          isPinned={secondSidebarPinned}
          title={secondSideBarData.title}
          items={secondSideBarData.items}
          isExpanded={secondSidebarClass == "" ? false : true}
        />
        <main
          onClick={() => {
            clickOutsideSecondSidebar();
          }}
          className={`${classes.main} scroll`}
        >
          <div className={`${classes.paramsDiv}`}>
            <ParamsWatcher />
          </div>
          <div className={`${classes.routesDiv}`}>
            <Routes>
              <Route path="/client/*" element={<Client />} />
              {/* Dashboard Just Before Last Route */}
              <Route path="/" element={<Dashboard />} />
              {/* LAST ROUTE */}
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
      <AppFooter />
    </div>
  );
}
