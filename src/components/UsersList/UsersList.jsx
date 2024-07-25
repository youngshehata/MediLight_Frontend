import { useContext, useEffect, useRef, useState } from "react";
import classes from "./UsersList.module.css";
import SearchInput from "../SearchInput/SearchInput";
import { language } from "../../utilities/language";
import { LanguageContext } from "../../App";
import toast from "react-hot-toast";

export default function UsersList({
  titleText,
  isAdding,
  list,
  excuteFunction,
  updateUsersList,
  currentGroup,
  // addToGroupFunction,
}) {
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [selectingClass, setSelectingClass] = useState("");
  const currentLanguage = useContext(LanguageContext);

  const currentTitle = useRef();

  // ========================================================================
  const checkElement = (parentObject) => {
    const foundInSelected = selectedUsers.find((x) => {
      return x.id == parentObject.id;
    });
    if (foundInSelected) {
      // Remove From List
      let theIndex = selectedUsers.indexOf(foundInSelected);
      let newSelectedUsers = [...selectedUsers];
      newSelectedUsers.splice(theIndex, 1);
      setSelectedUsers(newSelectedUsers);
      let clone = [...data];
      const recordInData = data.find((r) => {
        return r.id == parentObject.id;
      });
      const indexInData = data.indexOf(recordInData);
      clone.splice(indexInData, 1, {
        name: foundInSelected.name,
        id: foundInSelected.id,
        selected: false,
      });
      // setData(clone);
      updateUsersList(clone);
    } else {
      // Add To List
      const foundInData = data.find((x) => {
        return x.id == parentObject.id;
      });
      const newItemToSelectedList = { ...foundInData, selected: true };
      let theIndex = data.indexOf(foundInData);
      let clone = [...data];
      clone.splice(theIndex, 1, newItemToSelectedList);
      let newSelectedUsers = [...selectedUsers];
      newSelectedUsers.push(newItemToSelectedList);
      setSelectedUsers(newSelectedUsers);
      // setData(clone);
      updateUsersList(clone);
    }
  };
  // ========================================================================

  const filterList = (text) => {
    if (text == "") {
      // let newDataArray = [...originalData].map((r) => {
      let newDataArray = [...originalData].map((r) => {
        const foundInSelected = selectedUsers.find((x) => {
          return x.id == r.id;
        });
        if (foundInSelected) {
          return { ...r, selected: true };
        } else {
          return r;
        }
      });

      setOriginalData(newDataArray);
      updateUsersList(newDataArray);
      return;
    }

    let resultsList = [];

    originalData.forEach((record) => {
      if (record?.name?.toLowerCase().includes(text.toLowerCase())) {
        let isSelected = data.find((r) => {
          return r.id == record.id;
        }).selected;
        resultsList.push({ ...record, selected: isSelected });
      }
    });
    // setData(resultsList);
    if (resultsList.length > 0) {
      updateUsersList(resultsList);
    } else {
      toast.error(language.noMatching[currentLanguage]);
    }
  };

  const handleSubmit = () => {
    let clone = [...selectedUsers].map((user) => {
      return user.id;
    });
    excuteFunction(clone);
  };

  useEffect(() => {
    if (currentTitle.current && currentTitle.current != currentGroup) {
      setSelectedUsers([]);
    }
    currentTitle.current = currentGroup;

    if (isAdding) {
      setSelectingClass("liGreen");
    } else {
      setSelectingClass("liRed");
    }

    if (originalData.length < 1) {
      setOriginalData(list);
    }

    setData(list);
    setCount(selectedUsers.length);

    if (list.length == 0) {
      setSelectedUsers([]);
    }
  }, [data, list]);

  return (
    <div className={classes.container}>
      <span className={classes.title}>{titleText}</span>

      <div className={classes.optionsBar}>
        <SearchInput
          searchFunction={filterList}
          containerCSS={classes.SearchInput}
        />

        {data.length > 0 ? (
          <button
            onClick={() => {
              // excuteFunction(JSON.stringify(selectedUsers));
              handleSubmit();
            }}
            className={`${classes.button} ${
              isAdding ? classes.buttonAdd : classes.buttonRemove
            } ${selectedUsers.length > 0 ? "" : classes.buttonDisabled}`}
          >
            {isAdding
              ? language.addSelected[currentLanguage]
              : language.removeSelected[currentLanguage]}
          </button>
        ) : (
          <div className="emptyDiv"></div>
        )}
        {/* </div> */}
        <div className={classes.count}>
          {count > 0
            ? `[ ${count} ] ${language.selected[currentLanguage]}`
            : ``}
        </div>
      </div>
      <ul className={`${classes.ul} scroll`}>
        {data.map((record, index) => {
          return (
            <li
              id={record.id}
              className={`${classes.li} ${
                record.selected ? classes[selectingClass] : null
              }`}
              key={index + 1}
            >
              <div
                onClick={() => {
                  checkElement(record);
                }}
                className={classes.checkBoxDiv}
              >
                <img src="/correctWhite.svg" alt="checked" />
              </div>
              <span className={classes.liName}>{record.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
