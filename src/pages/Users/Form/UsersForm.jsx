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
import { useNavigate, useParams } from "react-router-dom";
import UserResetPassword from "./UserResetPassword";

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
  const [viewMode, setViewMode] = useState(false);
  const [showResetPassowrd, setShowResetPassowrd] = useState(false);

  const usernameRef = useRef();
  // const passwordRef = useRef();
  // const passwordConfirmRef = useRef();
  const groupRef = useRef();

  const navigate = useNavigate();
  const params = useParams();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name == "userType") {
      setFormData({
        ...formData,
        userType: value,
        roles: [
          `${
            groupsList.find((r) => {
              return r.value == value;
            }).value
          }`,
        ],
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const gatherData = async () => {
    try {
      setLoading(true);
      // Groups
      if (groupsList.length < 1) {
        const fetchedRoles = await fetchFromApi(
          "V1/AuthorizationRouting/Roles/Role-List",
          "GET"
        );
        const formattedList = [...fetchedRoles.data.data].map((opt) => {
          return {
            value: opt.id,
            labelAr: opt.name,
            labelEn: opt.name,
          };
        });

        // pushing -Not Selected- Option
        formattedList.unshift({
          value: 0,
          labelAr: "غير محدد",
          labelEn: "None",
        });

        // if group list not selected use first option
        if (!formData.userType) {
          setFormData({
            ...formData,
            userType: formattedList[0]?.value,
            roles: [`${formattedList[0]?.value}`],
          });
        }
        ///============================================

        setGroupsList(formattedList);
      }
      setLoading(false);
    } catch (error) {
      handleErrors(error);
      toast(language.internalError[currentLanguage]);
    }
  };

  const handleSubmit = (e) => {
    if (editMode) {
      e.preventDefault();
      setLoading(true);
      fetchFromApi("ApplicationUser/Api/V1/User/Edit", "PUT", {
        userName: formData.userName,
        roles: formData.roles,
        id: params.id,
      })
        .then(() => {
          setLoading(false);
          toast.success(language.addedSuccessfully[currentLanguage]);
          navigate("/medilight/admin/users");
        })
        .catch((err) => {
          setLoading(false);
          handleErrors(err);
        });
    } else {
      e.preventDefault();

      setLoading(true);
      const requestBody = { ...formData };
      if (requestBody.roles[0].toString() == "0") {
        console.log("wrong");
        requestBody.roles = null;
      }
      console.log(requestBody);
      fetchFromApi("ApplicationUser/Api/V1/User/Create", "POST", requestBody)
        .then(() => {
          setLoading(false);
          toast.success(language.addedSuccessfully[currentLanguage]);
          navigate("/medilight/admin/users");
        })
        .catch((err) => {
          setLoading(false);
          handleErrors(err);
        });
    }
  };

  const checkMode = () => {
    if (params.id) {
      const urlString = params["*"];
      if (urlString.includes("edit")) {
        setEditMode(true);
        setViewMode(false);
      } else {
        setEditMode(false);
        setViewMode(true);
      }
    }
  };

  const getUserData = (id) => {
    setLoading(true);
    fetchFromApi(`ApplicationUser/Api/V1/User/${id}`, "GET")
      .then((response) => {
        setLoading(false);
        setFormData({
          ...formData,
          userName: response.data.data.userName,
          userType: response.data.data.userType,
          roles: response.data.data.roleName,
        });
      })
      .catch((err) => {
        setLoading(false);
        handleErrors(err);
      });
  };

  //! Change password
  const changeUserPassword = (password, passwordConfirmation) => {
    setLoading(true);
    fetchFromApi("ApplicationUser/Api/V1/User/Change-Password", "PUT", {
      id: parseInt(params.id),
      // currentPassword: string,
      newPassword: password,
      confirmPassword: passwordConfirmation,
    })
      .then(() => {
        setLoading(false);
        toast.success(language.editedSuccessfully[currentLanguage]);
        setShowResetPassowrd(false);
      })
      .catch((err) => {
        setLoading(false);
        handleErrors(err);
      });
  };

  useEffect(() => {
    checkMode();
    gatherData();
    if (params.id) {
      getUserData(params.id);
    }
    usernameRef.current.children[1].focus();
  }, [groupsList]);
  return (
    <>
      {loading ? <Loading /> : null}
      {showResetPassowrd ? (
        <UserResetPassword
          closeFunction={() => {
            setShowResetPassowrd(false);
          }}
          excuteFunction={changeUserPassword}
        />
      ) : null}
      <div className={`${classes.container}`}>
        <form className={`${classes.form}`}>
          <span className={`${classes.title}`}>
            {editMode
              ? language.editUser[currentLanguage]
              : language.addNewUser[currentLanguage]}
          </span>
          {/* ************** Username ************* */}
          <LabelInput
            inputDefaultValue={formData.userName}
            isDisabled={viewMode}
            ref={usernameRef}
            containerCSS={`${classes.wrapper}`}
            inputName={"userName"}
            labelLanguageObject={{ en: "Username", ar: "إسم المستخدم" }}
            onChangeFunction={handleChange}
          />
          {/* ************** Password ************* */}
          {editMode ? null : (
            <LabelInput
              // ref={passwordRef}
              isDisabled={viewMode}
              containerCSS={`${classes.wrapper}`}
              inputName={"password"}
              labelLanguageObject={{ en: "Password", ar: "كلمة المرور" }}
              onChangeFunction={handleChange}
              inputType={"password"}
            />
          )}
          {/* ************** Password Confirmation ************* */}
          {editMode ? null : (
            <LabelInput
              // ref={passwordConfirmRef}
              isDisabled={viewMode}
              containerCSS={`${classes.wrapper}`}
              inputName={"confirmPassword"}
              labelLanguageObject={{
                en: "Password Confirmation",
                ar: "تأكيد كلمة المرور",
              }}
              onChangeFunction={handleChange}
              inputType={"password"}
            />
          )}
          {/* ************** Group ************* */}
          {editMode ? null : (
            <LabelSelect
              selectDefaultValue={formData.userType}
              isDisabled={viewMode}
              ref={groupRef}
              containerCSS={`${classes.wrapper}`}
              selectName={"userType"}
              onChangeFunction={handleChange}
              options={groupsList}
              labelLanguageObject={{
                en: "Group",
                ar: "المجموعة",
              }}
            />
          )}

          {editMode ? (
            <button
              className={classes.showResetButton}
              onClick={(e) => {
                e.preventDefault();
                setShowResetPassowrd(true);
              }}
            >
              {language.changePassword[currentLanguage]}
            </button>
          ) : null}

          <button
            onClick={handleSubmit}
            className={
              viewMode
                ? `${classes.button} buttonTranslateHover displayNone`
                : `${classes.button} buttonTranslateHover`
            }
          >
            {editMode
              ? language.edit[currentLanguage]
              : language.add[currentLanguage]}
          </button>
        </form>
      </div>
    </>
  );
}
