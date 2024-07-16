import { setPageTitle } from "../../utilities/titles";
import { useCallback, useContext, useEffect, useState } from "react";
import classes from "./Groups.module.css";
import { fetchFromApi } from "../../api/fetcher";
import Loading from "../../components/Loading/Loading";
import { handleErrors } from "../../utilities/errors";
import { language } from "../../utilities/language";
import { LanguageContext } from "../../App";
import GroupsList from "./GroupsList";
import Modal from "../../components/Modal/Modal";
import toast from "react-hot-toast";
import GroupsWindow from "./GroupsWindow";
import UsersList from "../../components/UsersList/UsersList";

export default function Groups() {
  setPageTitle("Create New Group", "إنشاء مجموعة جديدة");
  const [loading, setLoading] = useState(false);
  const [showModifyWindow, setShowModifyWindow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const [selectedGroup, setSelectedGroup] = useState({ name: null, id: null });
  const [selectedGroup, setSelectedGroup] = useState(null);
  // i dont like the following solution for triggering fetch function...
  const [updates, setUpdates] = useState(false);

  // Mode for users list (Add || REMOVE)
  const [listMode, setListMode] = useState("");

  const currentLanguage = useContext(LanguageContext);

  const fetchAllGroups = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchFromApi(
        "V1/AuthorizationRouting/Roles/Role-List",
        "GET"
      );
      setLoading(false);
      return response?.data?.data;
    } catch (error) {
      setLoading(false);
      handleErrors(error);
    }
  }, [updates]);

  const deleteFunction = useCallback(() => {
    fetchFromApi(
      `V1/AuthorizationRouting/Roles/Delete/${selectedGroup.id}`,
      "DELETE"
    )
      .then(() => {
        setShowModal(false);
        // fetchAllGroups();
        toast.success(language.deletedSuccessfully[currentLanguage]);
        setUpdates(!updates);
        return;
      })
      .catch((err) => {
        setShowModal(false);
        handleErrors(err);
      });
  }, [selectedGroup, updates]);

  const selectGroup = useCallback((group) => {
    setSelectedGroup(group);
  }, []);

  const showDeleteModal = useCallback(() => {
    setShowModal(true);
  }, []);
  const showAddEditWindow = useCallback(() => {
    setShowModifyWindow(true);
  }, []);

  const handleWindowExcute = useCallback(
    (newData) => {
      setLoading(true);
      if (selectedGroup) {
        // Edit
        fetchFromApi("V1/AuthorizationRouting/Roles/Edit", "POST", {
          id: selectedGroup.id,
          name: newData,
        })
          .then(() => {
            setLoading(false);
            toast.success(language.editedSuccessfully[currentLanguage]);
            setShowModifyWindow(false);
            setSelectedGroup(null); // trigger
            setUpdates(!updates);
            return;
          })
          .catch((err) => {
            setLoading(false);
            handleErrors(err);
            return;
          });
      } else {
        // Add
        fetchFromApi("V1/AuthorizationRouting/Roles/Create", "POST", {
          RoleName: newData,
        })
          .then(() => {
            setLoading(false);
            toast.success(language.addedSuccessfully[currentLanguage]);
            setShowModifyWindow(false);
            setSelectedGroup(null); // trigger
            setUpdates(!updates);
            return;
          })
          .catch((err) => {
            setLoading(false);
            handleErrors(err);
            return;
          });
      }
    },
    [selectedGroup]
  );

  useEffect(() => {}, [updates]);

  return (
    <>
      {loading ? <Loading /> : null}
      {showModifyWindow ? (
        <GroupsWindow
          isNew={!selectedGroup}
          excuteFunction={handleWindowExcute}
          closeFunction={() => {
            setShowModifyWindow(false);
          }}
        />
      ) : null}
      {showModal ? (
        <Modal
          noText={language.cancel[currentLanguage]}
          yesText={language.confirm[currentLanguage]}
          noFunction={() => {
            setShowModal(false);
          }}
          type={"warning"}
          title={language.warning[currentLanguage]}
          message={
            currentLanguage == "ar"
              ? "هل أنت متأكد من إنك تريد حذف هذه المجموعة؟"
              : "Are you sure you wanna delete this group?"
          }
          yesFunction={() => {
            deleteFunction();
          }}
        />
      ) : null}
      <div className={`${classes.container}`}>
        <section className={`${classes.groupsContainer}`}>
          <div className={`${classes.groupsTitle} flexCenterRow`}>
            <span>{language.groups[currentLanguage]}</span>
            <img
              onClick={() => {
                setSelectedGroup(null);
                setShowModifyWindow(true);
              }}
              src="/addWhite.svg"
              alt="add"
            />
          </div>
          <GroupsList
            showDeleteModal={showDeleteModal}
            showModifyWindow={showAddEditWindow}
            fetchFunction={fetchAllGroups}
            selectGroup={selectGroup}
          />
        </section>
        <section className={`${classes.usersContainer}`}>
          <UsersList
            titleText={`${language.users[currentLanguage]} ${
              listMode != "" ? `(${language[listMode][currentLanguage]})` : ""
            }`}
          />
        </section>
      </div>
    </>
  );
}
