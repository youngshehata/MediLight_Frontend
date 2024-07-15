import { useContext, useEffect, useState } from "react";
import classes from "./Groups.module.css";
import { language } from "../../utilities/language";
import { LanguageContext } from "../../App";
import OptionsDots from "../../components/OptionsDots/OptionsDots";
import toast from "react-hot-toast";
import SearchInput from "../../components/SearchInput/SearchInput";

export default function GroupsList({
  fetchFunction,
  showDeleteModal,
  showModifyWindow,
  selectGroup,
}) {
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const currentLanguage = useContext(LanguageContext);

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
      onClickFunction: () => {
        showModifyWindow();
      },
      backgroundColor: "#2F5597",
      color: "#fff",
    },
    {
      labelEn: "Delete",
      labelAr: "حذف",
      onClickFunction: showDeleteModal,
      // onClickFunction: () => {
      //   showDeleteModal();
      // },
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
    <div className={`${classes.groupListContainer} scroll`}>
      <SearchInput
        searchFunction={filterList}
        containerCSS={`${classes.searchInput}`}
      />
      <ul className={`${classes.groupUl} scroll`}>
        {data.length > 0 ? (
          data.map((record, index) => {
            {
              return (
                <li className={classes.li} key={index + 1}>
                  <span className={`${classes.recordName} flexCenterRow`}>
                    {record?.name}
                  </span>
                  <div className={classes.optionsContainer}>
                    <button>{language.viewUsers[currentLanguage]}</button>
                    <OptionsDots
                      selectGroupFunction={selectGroup}
                      parentObject={record}
                      dataArray={optionsArray}
                    />
                  </div>
                </li>
              );
            }
          })
        ) : (
          <div>{language.noRecords[currentLanguage]}</div>
        )}
      </ul>
    </div>
  );
}
