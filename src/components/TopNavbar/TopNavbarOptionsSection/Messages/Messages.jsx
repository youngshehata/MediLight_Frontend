import { useContext, useRef, useState } from "react";
import List from "../../../List/List";
import { LanguageContext } from "../../../../App";
import { language } from "../../../../language";
import classes from "./Messages.module.css";

export default function Messages() {
  const [newMessages, setNewMessages] = useState(false); // tiggers the red dot on the messages icon

  const dropDownRef = useRef();
  const currentLanguage = useContext(LanguageContext);

  return (
    <div className={`${classes.container} flexCenterColumn`}>
      {newMessages ? <span className={`${classes.newMessages}`}></span> : null}

      <img className={`${classes.img}`} src="/messages.svg" alt="messages" />
      <List
        ref={dropDownRef}
        listName={language.messages[currentLanguage]}
        viewAllLabel={language.viewAllMessages[currentLanguage]}
        notFoundLabel={language.messagesNotFound[currentLanguage]}
      />
    </div>
  );
}
