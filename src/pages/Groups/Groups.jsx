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
import { useNavigate } from "react-router-dom";

export default function Groups() {
  setPageTitle("Create New Group", "إنشاء مجموعة جديدة");
  const [loading, setLoading] = useState(false);
  const [showModifyWindow, setShowModifyWindow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupTitle, setSelectedGroupTitle] = useState(null);
  // i dont like the following solution for triggering fetch function...
  const [updates, setUpdates] = useState(false);
  // next state made to avoid re fetching the users everytime
  const [allFetchedUsers, setAllFetchedUsers] = useState([]);
  // next state made to avoid re fetching the users everytime
  const [allGroupsFetched, setAllGroupsFetched] = useState([]);

  // Mode for users list (add || remove)
  const [listMode, setListMode] = useState("");
  const [usersList, setUsersList] = useState([]);

  const currentLanguage = useContext(LanguageContext);

  const navigate = useNavigate();

  const fetchAllGroups = async () => {
    try {
      setLoading(true);
      const response = await fetchFromApi(
        "V1/AuthorizationRouting/Roles/Role-List",
        "GET"
      );
      setAllGroupsFetched(response?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleErrors(error);
    }
  };
  // const fetchAllGroups = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetchFromApi(
  //       "V1/AuthorizationRouting/Roles/Role-List",
  //       "GET"
  //     );
  //     setLoading(false);
  //     return response?.data?.data;
  //   } catch (error) {
  //     setLoading(false);
  //     handleErrors(error);
  //   }
  // }, [updates]);

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
    // }, [selectedGroup, updates]);
  }, [updates]); // below function (selectGroup now triggers updates)

  const selectGroup = useCallback(
    (group) => {
      setSelectedGroup(group);
      setUpdates(!updates);
    },
    [selectedGroup, updates]
  );

  const showDeleteModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const showAddEditWindow = useCallback(() => {
    setShowModifyWindow(true);
  }, []);

  //================================================================================

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
            // setUpdates(!updates);
            fetchGroupsFromApi();
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
            // setUpdates(!updates);
            fetchGroupsFromApi();
            return;
          })
          .catch((err) => {
            setLoading(false);
            handleErrors(err);
            return;
          });
      }
    },
    [selectedGroup, updates]
  );

  //================================================================================

  const showAllUsers = useCallback(
    (group) => {
      setLoading(true);
      // use selectedGroup.name for now, later when all endpoints changed to id use selectedGroup.id
      // using static 200  members in 1 page for now, adding pagiation later if needed
      const allUsers = [...allFetchedUsers];

      // looking for users who already part of the selected group, and prevent rendering them
      let newUsersList = [];
      allUsers.forEach((user) => {
        const belongs = [...user.roleName].find((r) => {
          return r.toString().toLowerCase().includes(group?.name.toLowerCase());
        });
        if (!belongs) {
          newUsersList.push({
            id: user.id,
            name: user.userName,
            selected: false,
          });
        } else {
          return;
        }
      });
      setUsersList(newUsersList);
      setListMode("add");
      setLoading(false);
    },
    [allFetchedUsers, usersList]
  );

  //================================================================================

  const showAllMembers = useCallback(
    (group) => {
      setLoading(true);
      // use selectedGroup.name for now, later when all endpoints changed to id use selectedGroup.id
      // using static 200  members in 1 page for now, adding pagiation later if needed
      const allUsers = [...allFetchedUsers];

      // looking for users who already part of the selected group, and prevent rendering them
      let newUsersList = [];
      allUsers.forEach((user) => {
        const belongs =
          [...user.roleName][0] == null
            ? false
            : [...user.roleName].find((r) => {
                return r
                  .toString()
                  .toLowerCase()
                  .includes(group?.name.toLowerCase());
              });
        if (belongs) {
          newUsersList.push({
            id: user.id,
            name: user.userName,
            selected: false,
          });
        } else {
          return;
        }
      });
      setUsersList(newUsersList);
      setListMode("remove");
      setLoading(false);
    },
    [allFetchedUsers, usersList]
  );

  //================================================================================

  const updateUsersList = useCallback((list) => {
    setUsersList(list);
  }, []);

  //================================================================================

  const updateGroupTitle = useCallback((title) => {
    setSelectedGroupTitle(title);
  }, []);

  //================================================================================
  const addToGroupFunction = useCallback(
    (arrayOfUsers) => {
      setLoading(true);
      fetchFromApi(`V1/AuthorizationRouting/Roles/Update-User-Roles`, "POST", {
        users: arrayOfUsers,
        roleId: selectedGroup.id,
      })
        .then(() => {
          toast.success(language.addedSuccessfully[currentLanguage]);
          setLoading(false);
          fetchUsersFromApi();
          setUsersList([]);
        })
        .catch((err) => {
          setLoading(false);
          handleErrors(err);
        });
    },
    [selectedGroup, updates]
  );
  //================================================================================
  const removeFromGroupFunction = useCallback(
    (arrayOfUsers) => {
      setLoading(true);
      fetchFromApi(`V1/AuthorizationRouting/Roles/Update-User-Roles`, "POST", {
        users: arrayOfUsers,
        roleId: selectedGroup.id,
      })
        .then(() => {
          toast.success(language.addedSuccessfully[currentLanguage]);
          setLoading(false);
          fetchUsersFromApi();
          setUsersList([]);
        })
        .catch((err) => {
          setLoading(false);
          handleErrors(err);
        });
    },
    [selectedGroup, updates]
  );
  //================================================================================

  const fetchUsersFromApi = () => {
    setLoading(true);
    fetchFromApi(
      `ApplicationUser/Api/V1/User/Paginated?PageNumber=1&PageSize=200`,
      "GET"
    )
      .then((response) => {
        const allUsers = [...response.data.data];
        setAllFetchedUsers(allUsers);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        handleErrors(err);
      });
  };
  //================================================================================

  const fetchGroupsFromApi = () => {
    setLoading(true);
    fetchFromApi(`V1/AuthorizationRouting/Roles/Role-List`, "GET")
      .then((response) => {
        const allGroups = [...response.data.data];
        setAllGroupsFetched(allGroups);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        handleErrors(err);
      });
  };

  useEffect(() => {
    if (allFetchedUsers.length < 1) {
      fetchUsersFromApi();
    }
    if (allGroupsFetched.length < 1) {
      fetchGroupsFromApi();
    }
  }, [updates, selectedGroup, allFetchedUsers, allGroupsFetched, usersList]);

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
          currentGroup={selectedGroup}
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
            <span>
              {`${language.groups[currentLanguage]}`}
              <span className={classes.selectedGroupTitle}>{`${
                selectedGroupTitle ? selectedGroupTitle : ""
              }`}</span>
            </span>
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
            // fetchFunction={fetchAllGroups}
            groupsList={allGroupsFetched}
            selectGroup={selectGroup}
            showAllUsers={showAllUsers}
            updateGroupTitle={updateGroupTitle}
            showAllMembers={showAllMembers}
          />
        </section>
        <section className={`${classes.usersContainer}`}>
          <UsersList
            updateUsersList={updateUsersList}
            titleText={`${language.users[currentLanguage]} ${
              listMode != "" ? `(${language[listMode][currentLanguage]})` : ""
            }`}
            isAdding={listMode == "add" ? true : false}
            list={usersList}
            currentGroup={selectedGroupTitle}
            excuteFunction={addToGroupFunction}
          />
        </section>
      </div>
    </>
  );
}
