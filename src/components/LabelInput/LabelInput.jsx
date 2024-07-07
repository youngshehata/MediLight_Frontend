import React, { useContext } from "react";
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

  return (
    <div ref={ref} className={containerCSS}>
      <label htmlFor={inputName || null}>
        {labelLanguageObject[currentLanguage]}
      </label>
      <input
        spellCheck={false}
        name={inputName || null}
        type={inputType || "text"}
        disabled={isDisabled}
        onChange={onChangeFunction}
        placeholder={inputPlaceHolder || null}
        defaultValue={inputDefaultValue || null}
      />
    </div>
  );
};
export default React.forwardRef(LabelInput);
