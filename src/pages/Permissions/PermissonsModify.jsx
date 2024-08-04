import { useContext, useEffect, useState } from "react";
import { language } from "../../utilities/language";
import classes from "./Permissions.module.css";
import { LanguageContext } from "../../App";
import PermissionsEntities from "./PermissionsEntities";
import Loading from "../../components/Loading/Loading";
import PermissionsList from "./PermissionsList";

export default function PermissonsModify() {
  const currentLanguage = useContext(LanguageContext);

  //! States
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState("grant");
  const [permissionsList, setPermissionsList] = useState([]);
  const [formattedPermissionsList, setFormattedPermissionsList] = useState([]);
  const [entitesList, setEntitesList] = useState([]);
  const [recivers, setRecivers] = useState({ type: "users", list: [] });

  //! Handlers
  const activateGrant = () => {
    if (activeMode !== "grant") {
      setActiveMode("grant");
    }
  };

  //******************************************************************

  const activateRemove = () => {
    if (activeMode !== "remove") {
      setActiveMode("remove");
    }
  };

  //******************************************************************

  const formatPermissionsList = () => {
    let clone = [...permissionsList];
    //TODO      assuming permissions will look like following (without group)
    //TODO      {id:1 , name:"client-organization"}
    let permissionsGroupsList = []; // {group: client, children:[{id:1, name:add-user}]}
    // getting groups names by first word before "-"
    clone.forEach((permission) => {
      const firstWord = permission.name.split("-")[0];
      // checking if exists already in groups list

      let groupExists = permissionsGroupsList.find((x) => {
        return x.group?.toLowerCase() == firstWord.toLowerCase();
      });
      // getting the permission name without the group name, to push it into its group

      let removeGroupName = permission.name.split("-");
      removeGroupName.shift(); // Remove the first word

      let permissionNameWithoutGroup = removeGroupName.join("-"); // Combine the remaining words back

      if (!groupExists) {
        permissionsGroupsList.push({
          group: firstWord,
          children: [{ id: permission.id, name: permissionNameWithoutGroup }],
        });
      } else {
        // pushing the current permission to its group
        groupExists.children.push({
          id: permission.id,
          name: permissionNameWithoutGroup,
        });
      }
    });
    console.log(permissionsGroupsList);

    // end of looping
    setFormattedPermissionsList(permissionsGroupsList);
    return permissionsGroupsList;
  };

  //******************************************************************

  const switchReciversType = (type) => {
    if (type == "users" && recivers.type != "users") {
      setRecivers({ ...recivers, type: "users" });
      setEntitesList([]);
      // fetchUsers
    } else if (type == "groups" && recivers.type != "groups") {
      setRecivers({ ...recivers, type: "groups" });
      setEntitesList([]);
      // fetchGroups
    }
  };

  //******************************************************************

  const toggleEntitySelection = (id) => {
    const clone = [...entitesList];

    const elementToRemove = clone.find((x) => {
      return x.id == id;
    });

    let elementToAdd = { ...elementToRemove };
    elementToAdd.selected = !elementToAdd.selected;

    const indexToRemove = clone.indexOf(elementToRemove);
    clone.splice(indexToRemove, 1, elementToAdd);
    setEntitesList(clone);
  };

  //! Effect:
  useEffect(() => {
    // Dummy
    setEntitesList([
      { id: 1, labelEn: "Shehata", labelAr: "شحاته", selected: false },
      { id: 2, labelEn: "Omar", labelAr: "عمر", selected: true },
      { id: 3, labelEn: "Laila", labelAr: "ليلى", selected: false },
    ]);

    // Dummy
    if (permissionsList.length < 1) {
      setPermissionsList([
        { id: 1, name: "Client-organization-Add", selected: false },
        { id: 2, name: "Client-organization-Edit", selected: true },
        { id: 3, name: "Client-organization-Delete", selected: false },
        { id: 4, name: "admin-users", selected: false },
        { id: 5, name: "admin-users-add", selected: false },
        { id: 6, name: "admin-permissions-edit", selected: false },
      ]);
    }

    formatPermissionsList();
    //! INFINITE LOOP

    setLoading(false);
  }, [permissionsList]);

  return (
    <div className={classes.pmContainer}>
      {loading ? <Loading /> : null}
      {/* -------------- Permissions List  --------------------*/}
      <div className={classes.permissionsList}>
        <span className={classes.permissionsListTitle}>
          {language.permissionsList[currentLanguage]}
        </span>
        <PermissionsList formattedPermissionsList={formattedPermissionsList} />
      </div>
      {/* -------------- MODE (GRANT || REMOVE)  --------------------*/}
      <div className={classes.modeContainer}>
        <span>{language.mode[currentLanguage]}</span>
        <section className={classes.buttonsSection}>
          <button
            onClick={activateGrant}
            className={
              activeMode == "grant"
                ? `${classes.modeButton} ${
                    classes[`grantButton_${currentLanguage}`]
                  } ${classes.activeButton}`
                : `${classes.modeButton} ${
                    classes[`grantButton_${currentLanguage}`]
                  }`
            }
          >
            {language.grant[currentLanguage]}
          </button>
          <button
            onClick={activateRemove}
            className={
              activeMode == "remove"
                ? `${classes.modeButton} ${
                    classes[`removeButton_${currentLanguage}`]
                  } ${classes.activeButton}`
                : `${classes.modeButton} ${
                    classes[`removeButton_${currentLanguage}`]
                  }`
            }
          >
            {language.remove[currentLanguage]}
          </button>
        </section>
      </div>
      {/* -------------- Recivers (Users || Groups)  --------------------*/}
      <div className={classes.reciversContainer}>
        <div className={classes.reciversTitle}>
          <span>{language.entities[currentLanguage]}</span>
          <span className={classes.reciversTypeSpan}>{`(${
            recivers.type == "users"
              ? language.users[currentLanguage]
              : language.groups[currentLanguage]
          })`}</span>
        </div>
        <section className={classes.typeSection}>
          <button
            onClick={() => {
              switchReciversType("users");
            }}
            className={`${classes.typeButton} ${
              recivers.type == "users" ? `${classes["typeButton_active"]}` : ""
            }`}
          >
            {language.users[currentLanguage]}
          </button>
          <button
            onClick={() => {
              switchReciversType("groups");
            }}
            className={`${classes.typeButton} ${
              recivers.type == "groups" ? `${classes["typeButton_active"]}` : ""
            }`}
          >
            {language.groups[currentLanguage]}
          </button>
        </section>
        <PermissionsEntities
          mode={activeMode}
          list={entitesList}
          handleSelection={toggleEntitySelection}
        />
      </div>
      {/* -------------- Footer --------------------*/}
      <div className={classes.footerContainer}>
        <span
          className={
            activeMode == "grant" ? classes.greenSpan : classes.redSpan
          }
        >{`(${permissionsList.filter((x) => x.selected).length})`}</span>
        <span>
          {activeMode == "grant"
            ? language.permissionFooterGrant[currentLanguage]
            : language.permissionFooterRemove[currentLanguage]}
        </span>
        <span
          className={
            activeMode == "grant" ? classes.greenSpan : classes.redSpan
          }
        >{`(${entitesList.filter((x) => x.selected).length})`}</span>
        <span>
          {recivers.type == "users"
            ? language.user[currentLanguage]
            : language.group[currentLanguage]}
        </span>
        <button
          className={`${classes.submitPermissionsButton} ${
            classes[`submitPermissionsButton_${activeMode}`]
          }`}
        >
          {activeMode == "grant"
            ? language.grantPermissions[currentLanguage]
            : language.removePermissions[currentLanguage]}
        </button>
      </div>
    </div>
  );
}
