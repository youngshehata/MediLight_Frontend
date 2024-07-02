import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LanguageContext } from "../../App";
import styles from "./ParamsWatcher.module.css";
import { titles } from "../../utilities/titles";

export default function ParamsWatcher() {
  const currentLanguage = useContext(LanguageContext);
  const navigate = useNavigate();

  const imgUrl =
    currentLanguage == "ar" ? "/leftGreyArrow.svg" : "/rightGreyArrow.svg";

  const params = useParams();
  const paramsArray = params["*"]?.split("/");

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
