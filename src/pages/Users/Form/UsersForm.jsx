import classes from "./UsersForm.module.css";
import { language } from "../../../utilities/language";
import { LanguageContext } from "../../../App";
import { fetchFromApi } from "../../../api/fetcher";
import toast from "react-hot-toast";
import Loading from "../../../components/Loading/Loading";
import { handleErrors } from "../../../utilities/errors";
import { useContext, useEffect, useRef, useState } from "react";
import LabelInput from "../../../components/LabelInput/LabelInput";
import LabelSelect from "../../../components/LabelSelect/LabelSelect";

export default function UsersForm() {
  const currentLanguage = useContext(LanguageContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: null,
    password: null,
    confirmPassword: null,
    userType: null,
    roles: [],
  });
  const [groupsList, setGroupsList] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const usernameRef = useRef();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const gatherData = async () => {
    try {
      setLoading(true);
      // Groups
      if (groupsList.length < 1) {
        const fetchedCurrs = await fetchFromApi(
          //! CHANGE THIS TO ACTUAL GROUPS LIST
          "V1/CodesRouting/courtesyTitleList",
          "GET"
        );
        const formattedList = [...fetchedCurrs.data.data].map((opt) => {
          //! CHANGE THIS AS WELL
          return {
            value: opt.id,
            labelAr: opt.courtesyAr,
            labelEn: opt.courtesyEn,
          };
        });
        setGroupsList(formattedList);
      }
      setLoading(false);
    } catch (error) {
      handleErrors(error);
      toast(language.internalError[currentLanguage]);
    }
  };

  useEffect(() => {
    gatherData();
    usernameRef.current.children[1].focus();
  }, []);
  return (
    <>
      {loading ? <Loading /> : null}
      <div className={`${classes.container}`}>
        {/* <span className={`${classes.title}`}>
          {editMode
            ? language.editUser[currentLanguage]
            : language.addNewUser[currentLanguage]}
        </span> */}
        <form className={`${classes.form}`}>
          {/* ************** Username ************* */}
          <LabelInput
            ref={usernameRef}
            containerCSS={`${classes.wrapper}`}
            inputName={"userName"}
            labelLanguageObject={{ en: "Username", ar: "إسم المستخدم" }}
            onChangeFunction={handleChange}
          />
          {/* ************** Username ************* */}
          <LabelInput
            containerCSS={`${classes.wrapper}`}
            inputName={"password"}
            labelLanguageObject={{ en: "Password", ar: "كلمة المرور" }}
            onChangeFunction={handleChange}
            inputType={"password"}
          />
          {/* ************** Username ************* */}
          <LabelInput
            containerCSS={`${classes.wrapper}`}
            inputName={"confirmPassword"}
            labelLanguageObject={{
              en: "Password Confirmation",
              ar: "تأكيد كلمة المرور",
            }}
            onChangeFunction={handleChange}
            inputType={"password"}
          />
          {/* ************** Group ************* */}
          <LabelSelect
            containerCSS={`${classes.wrapper}`}
            onChangeFunction={handleChange}
            options={groupsList}
            labelLanguageObject={{
              en: "Group",
              ar: "المجموعة",
            }}
          />
          <button className={`${classes.button} buttonTranslateHover`}>
            {language.add[currentLanguage]}
          </button>
        </form>
      </div>
    </>
  );
}
