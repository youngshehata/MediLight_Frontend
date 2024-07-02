import { setPageTitle } from "../../utilities/titles";
import { useContext, useEffect, useState } from "react";
import classes from "./Organization.module.css";
import { language } from "../../utilities/language";
import { LanguageContext } from "../../App";
import { fetchFromApi } from "../../api/fetcher";
import toast from "react-hot-toast";
import Loading from "../../components/Loading/Loading";
import { useNavigate } from "react-router-dom";

export default function Organization() {
  setPageTitle("Create New Organization", "إنشاء منظمة جديدة");
  const currentLanguage = useContext(LanguageContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  const navigate = useNavigate();

  return (
    <>
      {loading ? <Loading /> : null}
      <div className={`${classes.container}`}></div>
      {/* <h1
        onClick={() => {
          navigate("add");
        }}
      >
        ADD
      </h1>
      <h1
        onClick={() => {
          navigate("edit/5");
        }}
      >
        EDIT
      </h1>
      <h2>DATA</h2> */}
    </>
  );
}
