import { useParams } from "react-router-dom";
import { setPageTitle } from "../../titles";
import { useContext, useEffect, useState } from "react";
import classes from "./Organization.module.css";
import { language } from "../../language";
import { LanguageContext } from "../../App";
import { fetchFromApi } from "../../api/fetcher";

export default function Organization() {
  setPageTitle("Create New Organization", "إنشاء منظمة جديدة");

  const currentLanguage = useContext(LanguageContext);

  const params = useParams();
  const [editMode, setEditMode] = useState(params.id ? true : false);
  const [dataObject, setDataObject] = useState({});
  const [loading, setLoading] = useState(true);
  const [governorates, setGovernorates] = useState([]);
  const [areas, setAreas] = useState([]);
  const [titles, setTitles] = useState([]);
  const [currencies, setCurrencies] = useState([
    { en: "EGP", ar: "جنيه" },
    { en: "USD", ar: "دولار" },
    { en: "EUR", ar: "يورو" },
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDataObject({ ...dataObject, [name]: value });
    console.log(dataObject);
  };

  const gatherData = async () => {
    try {
      // Titles
      if (titles.length < 1) {
        const fetchedTitles = await fetchFromApi(
          "V1/CodesRouting/courtesyTitleList",
          "GET"
        );
        setTitles(fetchedTitles.data.data);
      }

      // Governorates
      if (governorates.length < 1) {
        const fetchedGovernorates = await fetchFromApi(
          "V1/CodesRouting/GovernateList",
          "GET"
        );
        setGovernorates(fetchedGovernorates.data.data);
      }

      // Areas
      const fetchedAreas = await fetchFromApi(
        `V1/CodesRouting/AreaList/${dataObject.governorate || 1}`,
        "GET"
      );
      setAreas(fetchedAreas.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    gatherData();
  }, [dataObject]);

  return (
    <div className={`${classes.container}`}>
      <span className={`${classes.title}`}>
        {language.addNewOrganization[currentLanguage]}
      </span>
      <form className={`${classes.form}`}>
        {/* NAME */}
        <div className={`${classes.wrapper} ${classes.div1}`}>
          <label htmlFor="orgName">{language.name[currentLanguage]}</label>
          <input
            spellCheck={false}
            name="name"
            onChange={handleChange}
            type="text"
            id="orgName"
          />
        </div>
        {/* ------------------------------------ */}
        {/* Code */}
        <div className={`${classes.wrapper} ${classes.div2}`}>
          <label htmlFor="orgCode">{language.code[currentLanguage]}</label>
          <input
            spellCheck={false}
            name="code"
            onChange={handleChange}
            type="text"
            id="orgCode"
          />
        </div>
        {/* ------------------------------------ */}
        {/* Governorates */}
        <div className={`${classes.wrapper} ${classes.div3}`}>
          <label htmlFor="orgGovernorates">
            {language.governorate[currentLanguage]}
          </label>
          <select
            onChange={handleChange}
            name="governorate"
            id="orgGovernorates"
          >
            {governorates.map((gov) => {
              return (
                <option key={gov.id} value={gov.id}>
                  {currentLanguage == "ar" ? gov.arabicName : gov.englishName}
                </option>
              );
            })}
          </select>
        </div>
        {/* ------------------------------------ */}

        {/* Areas */}
        <div className={`${classes.wrapper} ${classes.div4}`}>
          <label htmlFor="orgAreas">
            {language.governorate[currentLanguage]}
          </label>
          <select onChange={handleChange} name="area" id="orgAreas">
            {areas.map((area) => {
              return (
                <option key={area.id} value={area.id}>
                  {currentLanguage == "ar" ? area.arabicName : area.englishName}
                </option>
              );
            })}
          </select>
        </div>
        {/* ------------------------------------ */}
        {/* Address */}
        <div className={`${classes.wrapper} ${classes.div5}`}>
          <label htmlFor="orgAddress">
            {language.address[currentLanguage]}
          </label>
          <input
            spellCheck={false}
            name="address"
            onChange={handleChange}
            type="text"
            id="orgAddress"
          />
        </div>
        {/* ------------------------------------ */}
        {/* Key Person */}
        <div className={`${classes.wrapper} ${classes.div6}`}>
          <label htmlFor="orgKeyPerson">
            {language.keyPerson[currentLanguage]}
          </label>
          <input
            spellCheck={false}
            name="keyPerson"
            onChange={handleChange}
            type="text"
            id="orgKeyPerson"
          />
        </div>
        {/* ------------------------------------ */}
        {/* Titles */}
        <div className={`${classes.wrapper} ${classes.div7}`}>
          <label htmlFor="orgTitles">
            {language.titleName[currentLanguage]}
          </label>
          <select onChange={handleChange} name="area" id="orgTitles">
            {titles.map((title) => {
              return (
                <option key={title.id} value={title.id}>
                  {currentLanguage == "ar"
                    ? title.courtesyAr
                    : title.courtesyEn}
                </option>
              );
            })}
          </select>
        </div>
        {/* ------------------------------------ */}
        {/* Job */}
        <div className={`${classes.wrapper} ${classes.div8}`}>
          <label htmlFor="orgJob">{language.job[currentLanguage]}</label>
          <input
            spellCheck={false}
            name="job"
            onChange={handleChange}
            type="text"
            id="orgJob"
          />
        </div>
        {/* ------------------------------------ */}

        {/* Currency */}
        <div className={`${classes.wrapper} ${classes.div9}`}>
          <label htmlFor="orgCurrency">
            {language.defaultCurrency[currentLanguage]}
          </label>
          <select
            onChange={handleChange}
            name="defaultCurrency"
            id="orgCurrency"
          >
            {currencies.map((defaultCurrency, index) => {
              return (
                <option key={index + 1} value={defaultCurrency}>
                  {currentLanguage == "ar"
                    ? defaultCurrency.ar
                    : defaultCurrency.en}
                </option>
              );
            })}
          </select>
        </div>

        {/* ------------------------------------ */}

        {/* Debit Account Number */}
        <div className={`${classes.wrapper} ${classes.div10}`}>
          <label htmlFor="orgDebitAcoountNumber">
            {language.debitAccountNumber[currentLanguage]}
          </label>
          <input
            spellCheck={false}
            name="debitAccountNumber"
            onChange={handleChange}
            type="text"
            id="orgDebitAcoountNumber"
          />
        </div>
        {/* ------------------------------------ */}
        {/* Type */}
        <div
          className={`${classes.wrapper} ${classes.typeChecbox} ${classes.div11}`}
        >
          <label htmlFor="orgType">
            {language.isOrganization[currentLanguage]}
          </label>
          <input
            spellCheck={false}
            name="type"
            onChange={(e) => {
              setDataObject({ ...dataObject, organization: e.target.checked });
            }}
            type="checkbox"
            id="orgType"
          />
        </div>
        {/* ------------------------------------ */}
        {/* Debit Profit Center */}
        <div className={`${classes.wrapper} ${classes.div12}`}>
          <label htmlFor="orgDebitProfitCenter">
            {language.debitProfitCenter[currentLanguage]}
          </label>
          <input
            spellCheck={false}
            name="debitProfitCenter"
            onChange={handleChange}
            type="text"
            id="orgDebitProfitCenter"
          />
        </div>
        {/* ------------------------------------ */}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className={`${classes.div13} ${classes.button}`}
          formAction="submit"
        >
          {language.add[currentLanguage]}
        </button>
      </form>
    </div>
  );
}
