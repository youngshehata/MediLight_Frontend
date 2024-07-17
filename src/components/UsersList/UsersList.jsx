import { useContext, useEffect, useState } from "react";
import classes from "./UsersList.module.css";
import SearchInput from "../SearchInput/SearchInput";
import { language } from "../../utilities/language";
import { LanguageContext } from "../../App";

export default function UsersList({
  titleText,
  isAdding,
  list,
  excuteFunction,
}) {
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [selectingClass, setSelectingClass] = useState(
    isAdding ? "liGreen" : "liRed"
  );
  const currentLanguage = useContext(LanguageContext);

  const checkElement = (e, parentObject) => {
    const foundInSelected = selectedUsers.find((x) => {
      return x.id == parentObject.id;
    });
    if (foundInSelected) {
      // Remove From List
      let theIndex = selectedUsers.indexOf(foundInSelected);
      let clone = [...selectedUsers];
      clone.splice(theIndex, 1);
      setSelectedUsers(clone);

      // CSS
      if (e.target.nodeName == "DIV") {
        e.target.parentElement.classList.remove(`${classes[selectingClass]}`);
      } else {
        e.target.parentElement.parentElement.classList.remove(
          `${classes[selectingClass]}`
        );
      }
    } else {
      // Add To List
      setSelectedUsers([...selectedUsers, parentObject]);

      // CSS
      if (e.target.nodeName == "DIV") {
        e.target.parentElement.classList.add(`${classes[selectingClass]}`);
      } else {
        e.target.parentElement.parentElement.classList.add(
          `${classes[selectingClass]}`
        );
      }
    }
  };

  const filterList = (text) => {
    if (text == "") {
      setData(originalData);
      return;
    }
    let resultsList = [];
    originalData.forEach((record) => {
      if (record?.name?.toLowerCase().includes(text.toLowerCase())) {
        resultsList.push({ ...record, hidden: false });
      } else {
        resultsList.push({ ...record, hidden: true });
      }
    });
    console.log(resultsList);
    setData(resultsList);
  };

  useEffect(() => {
    if (originalData.length < 1) {
      setOriginalData([
        { id: 1, name: "Ahmed Shehata", hidden: false },
        { id: 2, name: "Omar", hidden: false },
        { id: 3, name: "Dr. Mustafa Abd El Hafez", hidden: false },
        { id: 4, name: "Mr. Waleed El Sayeed", hidden: false },
        { id: 5, name: "Mohamed Shehata", hidden: false },
        { id: 6, name: "Laila", hidden: false },
        { id: 7, name: "Dr. Hadeer Mustafa", hidden: false },
        { id: 8, name: "Mr. Osama Ashraf", hidden: false },
      ]);
      setData([
        { id: 1, name: "Ahmed Shehata", hidden: false },
        { id: 2, name: "Omar", hidden: false },
        { id: 3, name: "Dr. Mustafa Abd El Hafez", hidden: false },
        { id: 4, name: "Mr. Waleed El Sayeed", hidden: false },
        { id: 5, name: "Mohamed Shehata", hidden: false },
        { id: 6, name: "Laila", hidden: false },
        { id: 7, name: "Dr. Hadeer Mustafa", hidden: false },
        { id: 8, name: "Mr. Osama Ashraf", hidden: false },
      ]);
    }
  }, []);

  return (
    <div className={classes.container}>
      <span className={classes.title}>{titleText}</span>
      <div className={classes.optionsBar}>
        {/* <div className={classes.searchAndButton}> */}
        <SearchInput
          searchFunction={filterList}
          containerCSS={classes.SearchInput}
        />
        {data.length > 0 ? (
          <button
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
              className={`${classes.li} ${record.hidden && "displayNone"}`}
              key={index + 1}
            >
              <div
                onClick={(e) => {
                  checkElement(e, record);
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
