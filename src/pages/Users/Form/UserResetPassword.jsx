import { useContext, useEffect, useState } from "react";
import classes from "../Users.module.css";
import { LanguageContext } from "../../../App";
import { language } from "../../../utilities/language";
import LabelInput from "../../../components/LabelInput/LabelInput";
export default function UserResetPassword({ closeFunction, excuteFunction }) {
  const currentLanguage = useContext(LanguageContext);
  const [activeClass, setActiveClass] = useState(null);
  const [passwordValue, setPasswordValue] = useState(null);
  const [passwordConfirmValue, setPasswordConfirmValue] = useState(null);

  const handleChangePassword = (e) => {
    setPasswordValue(e.target.value);
  };

  const handleChangePasswordConfrim = (e) => {
    setPasswordConfirmValue(e.target.value);
  };

  useEffect(() => {
    setActiveClass(classes.resetPasswordContainerActive);
  }, []);

  return (
    <div className={`${classes.resetPasswordContainer} ${activeClass}`}>
      <div className={classes.resetPasswordWindow}>
        <img
          onClick={closeFunction}
          src="/close.svg"
          alt="close"
          className={classes.groupsWindowClose}
        />
        <span className={classes.resetPasswordTitle}>
          {language.changePassword[currentLanguage]}
        </span>
        <LabelInput
          inputType={"password"}
          containerCSS={classes.password}
          inputName={"password"}
          labelLanguageObject={{
            en: "New Password:",
            ar: "كلمة المرور الجديدة",
          }}
          onChangeFunction={handleChangePassword}
        />
        <LabelInput
          inputType={"password"}
          containerCSS={classes.password}
          inputName={"passwordConfirm"}
          labelLanguageObject={{
            en: "New Password Confirmation:",
            ar: "تأكيد كلمة المرور الجديدة",
          }}
          onChangeFunction={handleChangePasswordConfrim}
        />
        <button
          onClick={() => {
            excuteFunction(passwordValue, passwordConfirmValue);
          }}
          className={`${classes.resetButton} buttonTranslateHover`}
        >
          {language.update[currentLanguage]}
        </button>
      </div>
    </div>
  );
}
