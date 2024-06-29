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
        <div className={`${classes.wrapper}`}>
          <label htmlFor="orgName">{language.name[currentLanguage]}</label>
          <input name="name" onChange={handleChange} type="text" id="orgName" />
        </div>
        {/* ------------------------------------ */}
        {/* Code */}
        <div className={`${classes.wrapper}`}>
          <label htmlFor="orgCode">{language.code[currentLanguage]}</label>
          <input name="code" onChange={handleChange} type="text" id="orgCode" />
        </div>
        {/* ------------------------------------ */}
        {/* Governorates */}
        <div className={`${classes.wrapper}`}>
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
        <div className={`${classes.wrapper}`}>
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
        <div className={`${classes.wrapper}`}>
          <label htmlFor="orgAddress">
            {language.address[currentLanguage]}
          </label>
          <input
            name="address"
            onChange={handleChange}
            type="text"
            id="orgAddress"
          />
        </div>
        {/* ------------------------------------ */}
        {/* Key Person */}
        <div className={`${classes.wrapper}`}>
          <label htmlFor="orgKeyPerson">
            {language.keyPerson[currentLanguage]}
          </label>
          <input
            name="keyPerson"
            onChange={handleChange}
            type="text"
            id="orgKeyPerson"
          />
        </div>
        {/* ------------------------------------ */}
        {/* Titles */}
        <div className={`${classes.wrapper}`}>
          <label htmlFor="orgTitles">{language.title[currentLanguage]}</label>
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
        <div className={`${classes.wrapper}`}>
          <label htmlFor="orgJob">{language.job[currentLanguage]}</label>
          <input name="job" onChange={handleChange} type="text" id="orgJob" />
        </div>
        {/* ------------------------------------ */}
        {/* Type */}
        <div className={`${classes.wrapper} ${classes.typeChecbox}`}>
          <label htmlFor="orgType">
            {language.isOrganization[currentLanguage]}
          </label>
          <input
            name="type"
            onChange={(e) => {
              setDataObject({ ...dataObject, organization: e.target.checked });
            }}
            type="checkbox"
            id="orgType"
          />
        </div>
        {/* ------------------------------------ */}
        //! CURRENCY
      </form>
    </div>
  );
}
