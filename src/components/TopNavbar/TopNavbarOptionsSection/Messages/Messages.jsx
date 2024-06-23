import { useContext, useEffect, useRef, useState } from "react";
import List from "../../../List/List";
import { LanguageContext } from "../../../../App";
import { language } from "../../../../language";
import classes from "./Messages.module.css";

export default function Messages() {
  const [newMessages, setNewMessages] = useState(false); // tiggers the red dot on the messages icon

  const dropDownRef = useRef();
  const containerRef = useRef();
  const currentLanguage = useContext(LanguageContext);

  const toggleList = () => {
    dropDownRef.current.classList.toggle("topBarListActive"); // this class on global.css
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      dropDownRef.current.classList.remove("topBarListActive");
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    // Cleanup function to remove listener on component unmount
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`${classes.container} flexCenterColumn`}>
      {newMessages ? <span className={`${classes.newMessages}`}></span> : null}

      <img
        onClick={() => {
          toggleList();
        }}
        className={`${classes.img}`}
        src="/messages.svg"
        alt="messages"
      />
      <List
        ref={dropDownRef}
        listName={language.messages[currentLanguage]}
        viewAllLabel={language.viewAllMessages[currentLanguage]}
        notFoundLabel={language.messagesNotFound[currentLanguage]}
      />
    </div>
  );
}
