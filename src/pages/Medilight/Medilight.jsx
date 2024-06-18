// This component will be working as router to the whole app for authorized user

import { useContext, useEffect } from "react";
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

export default function Medilight() {
  const navigate = useNavigate();

  const userInfo = useContext(AuthContext);

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
      <TopNavbar />
      <div className={`${classes.navAndMain}`}>
        {/*side bar and main are contained together for dynamic width */}
        <SideNavbar />
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
