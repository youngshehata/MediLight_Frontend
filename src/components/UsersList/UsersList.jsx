import { useContext, useEffect, useState } from "react";
import classes from "./UsersList.module.css";
import SearchInput from "../SearchInput/SearchInput";
import { language } from "../../utilities/language";
import { LanguageContext } from "../../App";

export default function UsersList({
  titleText,
  buttonText,
  list,
  excuteFunction,
}) {
  const [data, setData] = useState(list || []);
  const [count, setCount] = useState(8);
  const currentLanguage = useContext(LanguageContext);

  useEffect(() => {
    setData([
      { name: "Ahmed Shehata" },
      { name: "Omar" },
      { name: "Dr. Mustafa Abd El Hafez" },
      { name: "Mr. Waleed El Sayeed" },
    ]);
  }, []);

  return (
    <div className={classes.container}>
      <span className={classes.title}>{titleText}</span>
      <div className={classes.optionsBar}>
        {/* <div className={classes.searchAndButton}> */}
        <SearchInput containerCSS={classes.SearchInput} />
        <button className={`${classes.button} ${classes.buttonAdd}`}>
          {language.addSelected[currentLanguage]}
        </button>
        {/* </div> */}
        <div className={classes.count}>
          {count > 0
            ? `[ ${count} ] ${language.selected[currentLanguage]}`
            : ``}
        </div>
      </div>
      <ul className={classes.ul}>
        {data.map((record, index) => {
          return <li key={index + 1}></li>;
        })}
      </ul>
    </div>
  );
}
