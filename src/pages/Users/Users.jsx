import { setPageTitle } from "../../utilities/titles";
import { useState } from "react";
import classes from "./Users.module.css";
import { fetchFromApi } from "../../api/fetcher";
import Loading from "../../components/Loading/Loading";
import DataTable from "../../components/DataTable/DataTable";
import { handleErrors } from "../../utilities/errors";
import { language } from "../../utilities/language";

export default function Users() {
  setPageTitle("Create New User", "إنشاء مستخدم جديد");
  const [loading, setLoading] = useState(false);

  const fetchOrgnizations = async (pageNumber, pageSize) => {
    try {
      setLoading(true);
      const response = await fetchFromApi(
        `ApplicationUser/Api/V1/User/Paginated?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        "GET"
      );
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      handleErrors(err);
    }
  };

  const columnsObject = {
    userName: {
      en: "Username",
      ar: "إسم المستخدم",
      skip: false,
      widthPercentage: "40",
    },
    roleName: {
      en: "Group",
      ar: "المجموعة",
      skip: false,
      widthPercentage: "40",
    },
    edit: {
      en: "Edit",
      ar: "تعديل",
      skip: false,
      widthPercentage: "10",
    },
    delete: {
      en: "Delete",
      ar: "حذف",
      skip: false,
      widthPercentage: "10",
    },
  };

  return (
    <>
      {loading ? <Loading /> : null}
      <div className={`${classes.container}`}>
        <DataTable
          fetchFunction={fetchOrgnizations}
          columnsObject={columnsObject}
          editUrl={"/medilight/admin/users/edit"}
          viewUrl={"/medilight/admin/users"}
          deleteUrl={"ApplicationUser/Api/V1/User"}
          deleteMessageObject={{
            ar: "هل أنت متأكد من حذف هذا المستخدم؟",
            en: "Are you sure you wanna delete this user?",
          }}
          addNewLanguageObject={language.addNewUser}
          addNewUrl={"/medilight/admin/users/add"}
          addRole={"admin-users-add"}
          editRole={"admin-users-edit"}
          deleteRole={"admin-users-delete"}
        />
      </div>
    </>
  );
}
