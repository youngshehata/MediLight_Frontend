import { useContext, useEffect, useMemo, useState } from "react";
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
  showAllUsers,
  updateGroupTitle,
}) {
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const currentLanguage = useContext(LanguageContext);

  const gatherData = async () => {
    const fetchedData = await fetchFunction();
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

  const optionsArray = useMemo(() => {
    return [
      {
        labelEn: "Add Users",
        labelAr: "إضافة مستخدمين",
        onClickFunction: (group) => {
          showAllUsers(group);
          updateGroupTitle(` (${group.name}) `);
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
        backgroundColor: "#C00000",
        color: "#fff",
      },
    ];
  }, [showAllUsers]);

  useEffect(() => {
    if (originalData.length < 1) {
      gatherData();
    }
  }, [data, showAllUsers]);

  useEffect(() => {
    gatherData();
  }, [fetchFunction]);

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
