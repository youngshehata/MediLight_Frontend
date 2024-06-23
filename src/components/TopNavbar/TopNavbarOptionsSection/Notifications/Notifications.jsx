import { useContext, useEffect, useRef, useState } from "react";
import List from "../../../List/List";
import { LanguageContext } from "../../../../App";
import { language } from "../../../../language";
import classes from "./Notifications.module.css";
import { convertDate } from "../../../../common/DateAndTime";
import ShortNotification from "./ShortNotification/ShortNotification";

export default function Notifications() {
  const [newNotifications, setNewNotifications] = useState(false); // tiggers the red dot on the messages icon

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

  const dummyNotifications = [
    {
      date: new Date(),
      title: "Case of lun",
      details:
        "56 yo female pt. known case of lung ca s/p radio and chemotherapy.",
    },
    {
      date: new Date(),
      title: "Case of lun",
      details:
        "56 yo female pt. known case of lung ca s/p radio and chemotherapy known case of lung ca s/p radio and chemotherapy known case of lung ca s/p radio and chemotherapy.",
    },
    {
      date: new Date(),
      title: "Case of lun",
      details:
        "Starting.. Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message Testing for long message ",
    },
    {
      date: new Date(),
      title: "Case of lun",
      details:
        "56 yo female pt. known case of lung ca s/p radio and chemotherapy.",
    },
    {
      date: new Date(),
      title: "Case of lun",
      details:
        "56 yo female pt. known case of lung ca s/p radio and chemotherapy.",
    },
    {
      date: new Date(),
      title: "Case of lun",
      details:
        "56 yo female pt. known case of lung ca s/p radio and chemotherapy.",
    },
    {
      date: new Date(),
      title: "Case of lun",
      details:
        "56 yo female pt. known case of lung ca s/p radio and chemotherapy.",
    },
    {
      date: new Date(),
      title: "Case of lun",
      details:
        "56 yo female pt. known case of lung ca s/p radio and chemotherapy.",
    },
    {
      date: new Date(),
      title: "Case of lun",
      details:
        "56 yo female pt. known case of lung ca s/p radio and chemotherapy.",
    },
  ].map((msg, index) => {
    return (
      <ShortNotification
        key={index + 1}
        date={convertDate(new Date(msg.date))}
        title={msg.title}
        details={msg.details}
      />
    );
  });

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    // Cleanup function to remove listener on component unmount
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`${classes.container} flexCenterColumn`}>
      {newNotifications ? (
        <span className={`${classes.newNotifications}`}></span>
      ) : null}

      <img
        onClick={() => {
          toggleList();
        }}
        className={`${classes.img}`}
        src="/notification.svg"
        alt="notifications"
      />
      <List
        ref={dropDownRef}
        listName={language.notifications[currentLanguage]}
        viewAllLabel={language.viewAllNotifications[currentLanguage]}
        notFoundLabel={language.notificationsNotFound[currentLanguage]}
        items={dummyNotifications}
      />
    </div>
  );
}
