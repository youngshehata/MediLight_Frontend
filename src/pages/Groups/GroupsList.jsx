import { useContext, useEffect, useState } from "react";
import classes from "./Groups.module.css";
import { language } from "../../utilities/language";
import { LanguageContext } from "../../App";
import OptionsDots from "../../components/OptionsDots/OptionsDots";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SearchInput from "../../components/SearchInput/SearchInput";

export default function GroupsList({ fetchFunction }) {
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const currentLanguage = useContext(LanguageContext);

  const navigate = useNavigate();

  const gatherData = async () => {
    const fetchedData = await fetchFunction();
    console.log(fetchedData);
    setOriginalData(fetchedData);
    setData(fetchedData);
  };

  const filterList = (text) => {
    if (text == "") {
      setData(originalData);
      return;
    }
    let list = [];
    originalData.forEach((record) => {
      if (record?.name?.toLowerCase().includes(text.toLowerCase())) {
        list.push(record);
      }
    });
    setData(list);
  };

  const optionsArray = [
    {
      labelEn: "Add Users",
      labelAr: "إضافة مستخدمين",
      onClickFunction: () => {
        toast.success("Add Users");
      },
      backgroundColor: "#008000",
      color: "#fff",
    },
    {
      labelEn: "Edit",
      labelAr: "تعديل",
      onClickFunction: (id) => {
        navigate(`V1/AuthorizationRouting/Roles/Edit/${id}`);
      },
      backgroundColor: "#2F5597",
      color: "#fff",
    },
    {
      labelEn: "Delete",
      labelAr: "حذف",
      onClickFunction: () => {
        // functions with Modal coming from the parent Group component
        toast.error("Delete Users");
      },
      backgroundColor: "#C00000",
      color: "#fff",
    },
  ];

  useEffect(() => {
    if (originalData.length < 1) {
      gatherData();
    }
  }, [data]);

  return (
    <div className={classes.groupListContainer}>
      <SearchInput
        searchFunction={filterList}
        containerCSS={`${classes.searchInput}`}
      />
      <ul className={`${classes.groupUl} scroll`}>
        {data.map((record, index) => {
          {
            return (
              <li className={classes.li} key={index + 1}>
                <span className={`${classes.recordName} flexCenterRow`}>
                  {record?.name}
                </span>
                <div className={classes.optionsContainer}>
                  <button>{language.viewUsers[currentLanguage]}</button>
                  <OptionsDots parentId={record.id} dataArray={optionsArray} />
                </div>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
}
