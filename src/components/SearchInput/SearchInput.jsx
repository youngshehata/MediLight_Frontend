import React, { useContext, useState } from "react";
import { language } from "../../utilities/language";
import { LanguageContext } from "../../App";

const SearchInput = ({ searchFunction, containerCSS }, ref) => {
  const [inputValue, setInputValue] = useState("");
  const currentLanguage = useContext(LanguageContext);
  return (
    <div ref={ref} className={`${containerCSS} flexCenterRow`}>
      <input
        placeholder={language.search[currentLanguage]}
        spellCheck={false}
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (e.target.value == "") {
            searchFunction("");
          }
        }}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            searchFunction(e.target.value);
          }
        }}
      />
      <img
        style={{ position: "absolute" }}
        src="/searchNavy.svg"
        alt="search"
        onClick={() => {
          searchFunction(inputValue);
        }}
      />
    </div>
  );
};
export default React.forwardRef(SearchInput);
