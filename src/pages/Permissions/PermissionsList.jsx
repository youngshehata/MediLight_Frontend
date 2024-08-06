import { useContext } from "react";
import Selectable from "../../components/Selectable/Selectable";
import classes from "./Permissions.module.css";
import { LanguageContext } from "../../App";

export default function PermissionsList({
  formattedPermissionsList,
  handlePermissionSelection,
  handleGroupSelection,
  mode,
}) {
  const language = useContext(LanguageContext);

  // expand and collaps groups
  const toggleGroupExpanding = (element) => {
    element.target.parentElement.parentElement.classList.toggle(
      `${classes.groupExpanded}`
    );
  };

  return (
    <ul className={`${classes.listOfPermissionsGroups} scroll`}>
      {[...formattedPermissionsList].map((permissionGroup) => {
        return (
          <li
            className={
              permissionGroup.allSelected
                ? `${classes.permissionGroupClass} ${
                    classes.permissionGroupClassSelected
                  } ${classes[`permissionGroupClassSelected_${mode}`]}`
                : `${classes.permissionGroupClass}`
            }
          >
            <div>
              <div className={classes.permissionGroupTopDiv}>
                <span className={classes.permissionGroupName}>
                  {`${permissionGroup.group} ( ${permissionGroup.children.length} )`}
                </span>
                <img
                  onClick={toggleGroupExpanding}
                  className={classes.expandImg}
                  src="/downArrowNavy.svg"
                  alt="expand"
                />
                <div className={classes.wholeGroupSelectElement}>
                  <img
                    className={classes.wholeGroupSelectImg}
                    src="/correctWhite.svg"
                    alt="check"
                  />
                </div>
              </div>
              <ul className={`${classes.permissionsListInsideGroup} scroll`}>
                {permissionGroup.children.map((childPermission) => {
                  return (
                    <Selectable
                      key={childPermission.id}
                      id={childPermission.id}
                      handleSelection={handlePermissionSelection}
                      cssClass={classes.permissionLi}
                      backgroundColor={mode == "grant" ? "green" : "darkred"}
                      color={childPermission.selected ? "#fff" : "#000"}
                      isSelected={childPermission.selected}
                      label={
                        language == "ar"
                          ? childPermission.labelAr
                          : childPermission.labelEn
                      }
                    />
                  );
                })}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
