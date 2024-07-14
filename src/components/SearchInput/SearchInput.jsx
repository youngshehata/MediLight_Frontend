import React, { useState } from "react";

const SearchInput = ({ searchFunction, containerCSS }, ref) => {
  const [inputValue, setInputValue] = useState("");
  return (
    <div ref={ref} className={`${containerCSS} flexCenterRow`}>
      <input
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
