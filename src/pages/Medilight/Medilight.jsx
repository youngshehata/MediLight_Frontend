// This component will be working as router to the whole app for authorized user

import { useContext, useEffect } from "react";
import { AuthContext } from "../../App";
import { Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import toast from "react-hot-toast";
import NotFound from "../NotFound/NotFound";
import Organization from "../Organization/Organization";
import { language } from "../../language";

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
    <Routes>
      <Route path="/organization" element={<Organization />} />
      {/* Dashboard Just Before Last Route */}
      <Route path="/" element={<Dashboard />} />
      {/* LAST ROUTE */}
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}
