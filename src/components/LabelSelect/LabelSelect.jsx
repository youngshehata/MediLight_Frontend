import React, { useContext, useEffect } from "react";
import { LanguageContext } from "../../App";

const LabelSelect = (
  {
    containerCSS,
    labelLanguageObject,
    options, // {value:1,labelAr:"القاهرة",labelEn:"Cairo"}
    selectDefaultValue,
    onChangeFunction,
    isDisabled,
    selectName,
  },
  ref
) => {
  const currentLanguage = useContext(LanguageContext);
  useEffect(() => {}, [options]);

  return (
    <div ref={ref} className={containerCSS}>
      <label htmlFor={selectName || null}>
        {labelLanguageObject[currentLanguage]}
      </label>
      <select
        onChange={onChangeFunction}
        disabled={isDisabled}
        name={selectName || null}
        defaultValue={selectDefaultValue && selectDefaultValue}
      >
        {options
          ? options.map((opt, index) => {
              return (
                <option key={opt.value || index + 1} value={opt.value}>
                  {currentLanguage == "ar" ? opt.labelAr : opt.labelEn}
                </option>
              );
            })
          : null}
      </select>
    </div>
  );
};
export default React.forwardRef(LabelSelect);
