import { setPageTitle } from "../../utilities/titles";
import { useCallback, useContext, useState } from "react";
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

export default function Groups() {
  setPageTitle("Create New Group", "إنشاء مجموعة جديدة");
  const [loading, setLoading] = useState(false);
  const [showModifyWindow, setShowModifyWindow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const [selectedGroup, setSelectedGroup] = useState({ name: null, id: null });
  const [selectedGroup, setSelectedGroup] = useState(null);

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
  }, []);

  const deleteFunction = () => {
    fetchFromApi(
      `V1/AuthorizationRouting/Roles/Delete/${selectedGroup.id}`,
      "DELETE"
    )
      .then(() => {
        setShowModal(false);
        fetchAllGroups();
        toast.success(language.deletedSuccessfully[currentLanguage]);
      })
      .catch((err) => {
        setShowModal(false);
        handleErrors(err);
      });
  };

  const selectGroup = (group) => {
    setSelectedGroup(group);
  };

  const showDeleteModal = () => {
    setShowModal(true);
  };
  const showAddEditWindow = () => {
    setShowModifyWindow(true);
  };

  const handleWindowExcute = (newData) => {
    setLoading(true);
    if (selectedGroup) {
      // Edit
      fetchFromApi("V1/AuthorizationRouting/Roles/Edit", "POST", {
        Id: selectedGroup.id,
        RoleName: newData,
      })
        .then(() => {
          setLoading(false);
          toast.success(language.editedSuccessfully[currentLanguage]);
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
          return;
        })
        .catch((err) => {
          setLoading(false);
          handleErrors(err);
          return;
        });
    }
  };

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
        <section className={`${classes.usersContainer}`}></section>
      </div>
    </>
  );
}
