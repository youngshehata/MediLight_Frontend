import { useParams } from "react-router-dom";
import classes from "./Permissions.module.css";
import { useContext, useEffect, useState } from "react";
import { language } from "../../utilities/language";
import { LanguageContext } from "../../App";

export default function PermissionsForm() {
  const params = useParams();
  const currentLanguage = useContext(LanguageContext);

  //! States
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [formTitle, setFormTitle] = useState(null);

  //! Init
  const initForm = () => {
    if (params.id && params["*"].includes("edit")) {
      setEditMode(true);
      setFormTitle(language.editPermission[currentLanguage]);
    } else if (params.id && !params["*"].includes("edit")) {
      setViewMode(true);
      setFormTitle(language.viewPermission[currentLanguage]);
    } else {
      setFormTitle(language.addPermission[currentLanguage]);
    }
  };

  //! Effect
  useEffect(() => {
    initForm();
  }, []);

  return (
    <div className={classes.formContainer}>
      <form className={classes.form}>
        <span className={classes.formTitle}>{formTitle}</span>
      </form>
    </div>
  );
}
