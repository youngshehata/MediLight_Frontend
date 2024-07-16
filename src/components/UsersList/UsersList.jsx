import { useState } from "react";
import classes from "./UsersList.module.css";
import SearchInput from "../SearchInput/SearchInput";

export default function UsersList({
  titleText,
  buttonText,
  list,
  excuteFunction,
}) {
  const [data, setData] = useState(list || []);

  return (
    <div className={classes.container}>
      <span>{titleText}</span>
      <div className={classes.optionsBar}>
        <SearchInput containerCSS={classes.SearchInput} />
        <button>ADD</button>
        <div>SELECTED 9</div>
      </div>
      <ul className={classes.ul}>
        {data.map((record, index) => {
          return <li key={index + 1}></li>;
        })}
      </ul>
    </div>
  );
}
