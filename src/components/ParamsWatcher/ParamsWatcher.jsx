import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LanguageContext, RolesContext } from "../../App";
import styles from "./ParamsWatcher.module.css";
import { titles } from "../../utilities/titles";
import { authorizeParam } from "../../utilities/auth";
import toast from "react-hot-toast";
import { language } from "../../utilities/language";

export default function ParamsWatcher() {
  const currentLanguage = useContext(LanguageContext);
  const roles = useContext(RolesContext);
  const navigate = useNavigate();

  const imgUrl =
    currentLanguage == "ar" ? "/leftGreyArrow.svg" : "/rightGreyArrow.svg";

  const params = useParams();
  const paramsArray = params["*"]?.split("/");
  // Check if auth
  const [isAuthorized, setIsAuthorized] = useState(true);
  // Getting the current title
  let url = "medilight";
  for (let i = 0; i < paramsArray.length; i++) {
    // ignore IDs
    if (!parseInt(paramsArray[i])) {
      url = `${url}_${paramsArray[i]}`;
    }
  }
  let currentTitle = titles[url] || "Medilight";

  // replacing current page with home if just landed home
  if (paramsArray.length == 1 && paramsArray[0] == "") {
    localStorage.setItem(
      "currentTitle",
      JSON.stringify({ ar: "الرئيسية", en: "Home" })
    );
    currentTitle = { ar: "الرئيسية", en: "Home" };
  }

  const handleNavigate = (index) => {
    let url = "/medilight";
    for (let i = 0; i < index + 1; i++) {
      url = `${url}/${paramsArray[i]}`;
    }
    navigate(url);
  };

  useEffect(() => {
    let authBoolean = authorizeParam(paramsArray, roles);
    setIsAuthorized(authBoolean);
    if (!isAuthorized) {
      toast.error(language.unauthorized[currentLanguage]);
      navigate("/");
    }
  }, [isAuthorized, params]);

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.paramsContainer}`}>
        <div className="flexCenterRow">
          <span
            onClick={() => {
              navigate("/medilight");
            }}
          >
            medilight
          </span>
          <img className={`${styles.img}`} src={imgUrl} alt="arrow" />
        </div>
        {paramsArray.map((p, index) => {
          return (
            <div className={`flexCenterRow`} key={index + 1}>
              <span
                onClick={() => {
                  handleNavigate(index);
                }}
              >
                {p}
              </span>
              {index !== paramsArray.length - 1 ? (
                <img className={`${styles.img}`} src={imgUrl} alt="arrow" />
              ) : null}
            </div>
          );
        })}
      </div>
      <span className={`${styles.pageName}`}>
        {currentTitle ? currentTitle[currentLanguage] : "Medilight"}
      </span>
    </div>
  );
}
