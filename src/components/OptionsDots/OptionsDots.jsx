import React, { useContext, useEffect, useRef, useState } from "react";
import classes from "./OptionsDots.module.css";
import { LanguageContext } from "../../App";

const OptionsDots = ({ dataArray, parentObject, selectGroupFunction }, ref) => {
  // data array should contain array of objects like following
  // [ {labelEn:"Add New", labelAr:"إضافة جديدة", onClickFunction: ()=>{return 10}, backgroundColor:"#LMEEE32" colo:"#fff"} ]

  const currentLanguage = useContext(LanguageContext);

  const dropDownContainer = useRef();

  const [listActive, setListActive] = useState(false);
  const [data, setData] = useState(dataArray || []);

  const handleClickOutside = (event) => {
    if (
      dropDownContainer.current &&
      !dropDownContainer.current.contains(event.target)
    ) {
      setListActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dataArray]);

  return (
    <div ref={dropDownContainer} className={classes.container}>
      <img
        className={classes.img}
        src="/optionsDots.svg"
        alt="options"
        onClick={() => {
          selectGroupFunction(parentObject);
          setListActive(!listActive);
        }}
      />
      <div
        className={`${
          listActive
            ? `${
                currentLanguage == "ar"
                  ? classes.listActive_ar
                  : classes.listActive_en
              }`
            : classes.list
        } scroll`}
      >
        {data.map((opt, index) => {
          return (
            <span
              style={{ backgroundColor: opt.backgroundColor, color: opt.color }}
              className={classes.option}
              key={index + 1}
              onClick={() => {
                opt.onClickFunction(parentObject);
                setListActive(false);
              }}
            >
              {currentLanguage == "ar" ? opt.labelAr : opt.labelEn}
            </span>
          );
        })}
      </div>
    </div>
  );
};
export default React.forwardRef(OptionsDots);
