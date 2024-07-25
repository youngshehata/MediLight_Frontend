import { useContext, useEffect, useRef, useState } from "react";
import classes from "./Groups.module.css";
import { LanguageContext } from "../../App";
import { language } from "../../utilities/language";

export default function GroupsWindow({
  isNew,
  excuteFunction,
  closeFunction,
  currentGroup,
}) {
  const currentLanguage = useContext(LanguageContext);
  const [inputValue, setInputValue] = useState("");
  const [activeClass, setActiveClass] = useState("");

  const inputRef = useRef();

  useEffect(() => {
    // sadly i cant fix it without setTimeout
    let focusTimout = setTimeout(() => {
      inputRef.current.focus();
      clearTimeout(focusTimout);
    }, 250);

    const controller = new AbortController();
    setActiveClass(classes.windowContainerActive);
    return () => {
      controller.abort();
    };
  }, []);
  return (
    <div className={`${classes.windowContainer} ${activeClass}`}>
      <div className={classes.groupsWindow}>
        <img
          onClick={closeFunction}
          src="/close.svg"
          alt="close"
          className={classes.groupsWindowClose}
        />
        <span className={classes.groupsWindowTitle}>
          {isNew
            ? language.addNewGroup[currentLanguage]
            : language.editGroup[currentLanguage]}
        </span>
        {currentGroup?.name ? (
          <span className={classes.currentNameSpan}>{currentGroup.name}</span>
        ) : null}
        <input
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              excuteFunction(inputValue);
            }
          }}
          className={classes.groupsWindowInput}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          type="text"
          placeholder={language.name[currentLanguage]}
        />
        <button
          className={`${classes.groupsWindowButton} buttonTranslateHover`}
          onClick={() => {
            excuteFunction(inputValue);
          }}
        >
          {isNew
            ? language.add[currentLanguage]
            : language.edit[currentLanguage]}
        </button>
      </div>
    </div>
  );
}
