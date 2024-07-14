import React, { useContext, useRef } from "react";
import { LanguageContext } from "../../App";

const LabelInput = (
  {
    containerCSS,
    labelLanguageObject,
    inputDefaultValue,
    inputPlaceHolder,
    onChangeFunction,
    isDisabled,
    inputName,
    inputType,
  },
  ref
) => {
  const currentLanguage = useContext(LanguageContext);
  const inputRef = useRef();
  const imgRef = useRef();

  const handlePasswordIcon = () => {
    if (inputRef.current.type == "password") {
      imgRef.current.classList.add("passwordContainerActive");
      inputRef.current.type = "text";
    } else {
      imgRef.current.classList.remove("passwordContainerActive");
      inputRef.current.type = "password";
    }
  };

  return (
    <div ref={ref} className={containerCSS}>
      <label htmlFor={inputName || null}>
        {labelLanguageObject[currentLanguage]}
      </label>
      {inputType == "password" ? (
        <div className="flexCenterColumn">
          <input
            ref={inputRef}
            spellCheck={false}
            name={inputName || null}
            type={inputType || "text"}
            disabled={isDisabled}
            onChange={onChangeFunction}
            placeholder={inputPlaceHolder || null}
            defaultValue={inputDefaultValue || null}
          />
          <span
            onClick={handlePasswordIcon}
            ref={imgRef}
            className="passwordContainer flexCenterColumn"
          >
            <img src="/eye.svg" alt="show" />
          </span>
        </div>
      ) : (
        <input
          spellCheck={false}
          name={inputName || null}
          type={inputType || "text"}
          disabled={isDisabled}
          onChange={onChangeFunction}
          placeholder={inputPlaceHolder || null}
          defaultValue={inputDefaultValue || null}
        />
      )}
    </div>
  );
};
export default React.forwardRef(LabelInput);
