import { useContext } from "react";
import Selectable from "../../components/Selectable/Selectable";
import classes from "./Permissions.module.css";
import { LanguageContext } from "../../App";

export default function PermissionsList({
  formattedPermissionsList,
  handleSelection,
}) {
  const language = useContext(LanguageContext);

  return (
    <ul className={`${classes.entitiesList} scroll`}>
      {[...formattedPermissionsList].map((permissionGroup) => {
        console.log(permissionGroup);

        return (
          <li>
            <div>
              <span>{permissionGroup.group}</span>
              {/* toggle
                    select */}
            </div>
            <ul>
              {permissionGroup.children.map((childPermission) => {
                return <li>{childPermission.name}</li>; //! Change This To <Selectable/>
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
