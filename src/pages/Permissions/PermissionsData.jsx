import { useState } from "react";
import classes from "./Permissions.module.css";
import { fetchFromApi } from "../../api/fetcher";
import { handleErrors } from "../../utilities/errors";
import DataTable from "../../components/DataTable/DataTable";

export default function PermissionsData() {
  const [loading, setLoading] = useState(false);

  const fetchOrgnizations = async (pageNumber, pageSize) => {
    try {
      setLoading(true);
      const response = await fetchFromApi(
        `V1/Organization/Organization/Paginated?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        "GET"
      );
      setLoading(false);
      return response.data.data;
    } catch (err) {
      setLoading(false);
      handleErrors(err);
    }
  };

  const columnsObject = {
    name: {
      en: "Name (AR)",
      ar: "الأسم بالعربية",
      skip: false,
      widthPercentage: "40",
    },
    enName: {
      en: "Name (EN)",
      ar: "الأسم بالإنجليزية",
      skip: false,
      widthPercentage: "40",
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
    },
  };

  return (
    <div className={classes.dataContainer}>
      <DataTable
        fetchFunction={fetchOrgnizations}
        columnsObject={columnsObject}
        editUrl={"/medilight/admin/permissions/edit"}
        // deleteUrl={"V1/Organization/OrganizationDelete"}
        deleteFunction={() => {}}
        deleteMessageObject={{
          ar: "هل أنت متأكد من حذف هذه الصلاحية",
          en: "Are you sure you wanna delete this permissions?",
        }}
        addNewLanguageObject={{
          en: "Add New Permission",
          ar: "إضافة صلاحية جديدة",
        }}
        addNewUrl={"/medilight/admin/permissions/add"}
        addRole={"admin-permissions-add"}
        editRole={"admin-permissions-edit"}
        deleteRole={"admin-permissions-delete"}
        viewUrl={"/medilight/admin/permissions"}
      />
    </div>
  );
}
