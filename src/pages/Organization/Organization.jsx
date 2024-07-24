import { setPageTitle } from "../../utilities/titles";
import { useContext, useState } from "react";
import classes from "./Organization.module.css";
import { fetchFromApi } from "../../api/fetcher";
import Loading from "../../components/Loading/Loading";
import DataTable from "../../components/DataTable/DataTable";
import { handleErrors } from "../../utilities/errors";
import { language } from "../../utilities/language";
import toast from "react-hot-toast";
import { LanguageContext } from "../../App";

export default function Organization() {
  setPageTitle("Create New Organization", "إنشاء منظمة جديدة");
  const [loading, setLoading] = useState(false);

  const currentLanguage = useContext(LanguageContext);

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

  const deleteOrganization = async (id) => {
    try {
      setLoading(true);
      const response = await fetchFromApi(
        `V1/Organization/OrganizationDelete/${id}`,
        "POST"
      );
      if (response.status < 300) {
        toast.success(language.deletedSuccessfully[currentLanguage]);
        return true;
      }
    } catch (err) {
      setLoading(false);
      handleErrors(err);
      return false;
    }
  };
  // const deleteOrganization = async (id) => {
  //   setLoading(true);
  //   fetchFromApi(`V1/Organization/OrganizationDelete/${id}`, "POST")
  //     .then(async () => {
  //       setLoading(false);
  //       toast.success(language.deletedSuccessfully[currentLanguage]);
  //       return true;
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setLoading(false);
  //       handleErrors(err);
  //       return false;
  //     });
  // };

  const columnsObject = {
    name: {
      en: "Name (AR)",
      ar: "الأسم بالعربية",
      skip: false,
      widthPercentage: "20",
    },
    enName: {
      en: "Name (EN)",
      ar: "الأسم بالإنجليزية",
      skip: false,
      widthPercentage: "20",
    },
    governoratesname: {
      en: "Governorate",
      ar: "المحافظة",
      skip: false,
      widthPercentage: "10",
    },

    areasname: {
      en: "Area",
      ar: "المنطقة",
      skip: false,
      widthPercentage: "10",
    },
    organizationCode: {
      en: "Code",
      ar: "الرمز",
      skip: false,
      widthPercentage: "10",
    },
    keyperson: {
      en: "Key Person",
      ar: "الرمز الشخصى",
      skip: false,
      widthPercentage: "10",
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
    courtesy: {
      en: "Courtesy Id",
      ar: "رقم اللقب",
      skip: true,
      widthPercentage: "10",
    },
    courtesyName: {
      en: "Courtesy",
      ar: "اللقب",
      skip: true,
      widthPercentage: "10",
    },
    area: {
      en: "Area Id",
      ar: "رقم المنطقة",
      skip: true,
      widthPercentage: "10",
    },
    debitAccountNo: {
      en: "Debit Account No.",
      ar: "رقم حساب المدين",
      skip: true,
      widthPercentage: "10",
    },
    debitProfitCenter: {
      en: "Debit Profile Center",
      ar: "مركز أرباح المدين",
      skip: true,
      widthPercentage: "10",
    },
    defaultCurrency: {
      en: "Default Currency",
      ar: "العملة الإفتراضية",
      skip: true,
      widthPercentage: "10",
    },
    governorate: {
      en: "governorateId",
      ar: "رقم المحافظة",
      skip: true,
      widthPercentage: "10",
    },
    id: { en: "id", ar: "رقم", skip: true, widthPercentage: "10" },
    individuals: {
      en: "Individual",
      ar: "شخص",
      skip: true,
      widthPercentage: "10",
    },

    logo: {
      en: "logo",
      ar: "لوجو",
      skip: true,
      widthPercentage: "10",
    },

    savedToFMIS: {
      en: "savedFMIS",
      ar: "محفوظ",
      skip: true,
      widthPercentage: "10",
    },
    secUserAccountID: {
      en: "AgentId",
      ar: "رقم الممثل",
      skip: true,
      widthPercentage: "10",
    },
    title: {
      en: "Title",
      ar: "عنوان",
      skip: true,
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
          editUrl={"/medilight/client/organization/edit"}
          // deleteUrl={"V1/Organization/OrganizationDelete"}
          deleteFunction={deleteOrganization}
          deleteMessageObject={{
            ar: "هل أنت متأكد من حذف هذه المنظمة؟",
            en: "Are you sure you wanna delete this organization?",
          }}
          addNewLanguageObject={language.addNewOrganization}
          addNewUrl={"/medilight/client/organization/add"}
          addRole={"client-organization-add"}
          editRole={"client-organization-edit"}
          deleteRole={"client-organization-delete"}
          viewUrl={"/medilight/client/organization/view"}
        />
      </div>
    </>
  );
}
