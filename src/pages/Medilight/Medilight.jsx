// This component will be working as router to the whole app for authorized user

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import { Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import toast from "react-hot-toast";
import NotFound from "../NotFound/NotFound";
import Organization from "../Organization/Organization";
import { language } from "../../language";
import TopNavbar from "../../components/TopNavbar/TopNavbar";
import classes from "./Medilight.module.css";
import SideNavbar from "../../components/SideNavbar/SideNavbar";
import AppFooter from "../../components/AppFooter/AppFooter";

export default function Medilight({ changeLanguage, changeAuth }) {
  const navigate = useNavigate();

  const userInfo = useContext(AuthContext);

  // State for toggling the sidebar (State lifting)
  // This ( sideExpanded ) class is defined on App.css , cuz its not module
  const [sidebarClass, setSidebarClass] = useState("");
  const handleSideBarClassChange = () => {
    sidebarClass == "" ? setSidebarClass("sideExpanded") : setSidebarClass("");
  };

  // im getting the language from local storage not from the context cuz this component would have many childs
  // and if i pulled the context here and it changed later, this component will be rerendered, with all of those many childs
  const currentLanguage = localStorage.getItem("lang") || "en";

  useEffect(() => {
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
        {/*side bar and main are contained together for dynamic width */}
        <SideNavbar sidebarClass={sidebarClass} />
        <main className={`${classes.main} scroll`}>
          <Routes>
            <Route path="/organization" element={<Organization />} />
            {/* Dashboard Just Before Last Route */}
            <Route path="/" element={<Dashboard />} />
            {/* LAST ROUTE */}
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <AppFooter />
    </div>
  );
}
