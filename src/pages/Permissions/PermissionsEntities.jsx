import { useContext } from "react";
import Selectable from "../../components/Selectable/Selectable";
import classes from "./Permissions.module.css";
import { LanguageContext } from "../../App";

export default function PermissionsEntities({ list, mode }) {
  const language = useContext(LanguageContext);

  return (
    <ul className={`${classes.entitiesList} scroll`}>
      {[...list].map((record) => {
        return (
          <Selectable
            cssClass={classes.entity}
            backgroundColor={mode == "grant" ? "green" : "darkred"}
            color={record.selected ? "#fff" : "#000"}
            isSelected={record.selected}
            label={language == "ar" ? record.labelAr : record.labelEn}
          />
        );
      })}
    </ul>
  );
}
