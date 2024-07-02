import { useNavigate, useParams } from "react-router-dom";
import { setPageTitle } from "../../../utilities/titles";
import { useContext, useEffect, useRef, useState } from "react";
import classes from "./OrganizationForm.module.css";
import { language } from "../../../utilities/language";
import { LanguageContext } from "../../../App";
import { fetchFromApi } from "../../../api/fetcher";
import toast from "react-hot-toast";
import Loading from "../../../components/Loading/Loading";
import { handleErrors } from "../../../utilities/errors";

export default function OrganizationForm() {
  setPageTitle("Create New Organization", "إنشاء منظمة جديدة");

  const currentLanguage = useContext(LanguageContext);

  const navigate = useNavigate();

  const params = useParams();
  const [editMode, setEditMode] = useState(params.id ? true : false);
  const [dataObject, setDataObject] = useState({
    individuals: true,
    enName: "english",
    secUserAccountID: 2,
  });
  const [loading, setLoading] = useState(true);
  const [governorates, setGovernorates] = useState([]);
  const [areas, setAreas] = useState([]);
  const [titles, setTitles] = useState([]);
  const [currencies, setCurrencies] = useState([
    { en: "EGP", ar: "جنيه" },
    { en: "USD", ar: "دولار" },
    { en: "EUR", ar: "يورو" },
  ]);

  const governorateRef = useRef();
  const areaRef = useRef();
  const courtesyRef = useRef();
  const currencyRef = useRef();
  const logoInputRef = useRef();
  const logoImgRef = useRef();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDataObject({ ...dataObject, [name]: value });
    console.log(name, " - ", value);
  };

  const gatherData = async () => {
    try {
      setLoading(true);
      // Titles
      if (titles.length < 1) {
        const fetchedTitles = await fetchFromApi(
          "V1/CodesRouting/courtesyTitleList",
          "GET"
        );
        setTitles(fetchedTitles.data.data);
        // setDataObject({
        //   ...dataObject,
        //   courtesy: fetchedTitles.data.data[0].id,
        // });
      }

      // Governorates
      if (governorates.length < 1) {
        const fetchedGovernorates = await fetchFromApi(
          "V1/CodesRouting/GovernateList",
          "GET"
        );
        setGovernorates(fetchedGovernorates.data.data);
        // setDataObject({
        //   ...dataObject,
        //   governorate: fetchedGovernorates.data.data[0].id,
        // });
      }

      // Areas
      const fetchedAreas = await fetchFromApi(
        `V1/CodesRouting/AreaList/${dataObject.governorate || 1}`,
        "GET"
      );
      setAreas(fetchedAreas.data.data);
      // setDataObject({ ...dataObject, area: fetchedAreas.data.data[0].id });
      setLoading(false);
    } catch (error) {
      toast(language.internalError[currentLanguage]);
    }
  };

  const handleBase64Convert = (file) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      let base64String = reader.result;
      let comaIndex = base64String.indexOf(",");
      base64String = base64String.substring(comaIndex + 1, base64String.length);
      setDataObject({ ...dataObject, logo: base64String });
    };
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    dataObject.governorate = +governorateRef.current.value;
    dataObject.area = +areaRef.current.value;
    dataObject.courtesy = +courtesyRef.current.value;
    dataObject.currency = currencyRef.current.value;
    console.log(dataObject);
    fetchFromApi("V1/Organization/Organization/Create", "POST", dataObject)
      .then(() => {
        setLoading(false);
        toast.success(language.addedSuccessfully[currentLanguage]);
        navigate("/medilight/client/organization");
      })
      .catch((err) => {
        handleErrors(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    gatherData();
  }, [dataObject?.governorate]);

  return (
    <>
      {loading ? <Loading /> : null}
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
              name="organizationCode"
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
              ref={governorateRef}
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
            <label htmlFor="orgAreas">{language.area[currentLanguage]}</label>
            <select
              ref={areaRef}
              onChange={handleChange}
              name="area"
              id="orgAreas"
            >
              {areas.map((area) => {
                return (
                  <option key={area.id} value={area.id}>
                    {currentLanguage == "ar"
                      ? area.arabicName
                      : area.englishName}
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
              name="keyperson"
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
            <select
              ref={courtesyRef}
              onChange={handleChange}
              name="courtesy"
              id="orgTitles"
            >
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
              ref={currencyRef}
              onChange={handleChange}
              name="defaultCurrency"
              id="orgCurrency"
            >
              {currencies.map((defaultCurrency, index) => {
                return (
                  <option key={index + 1} value={defaultCurrency.en}>
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
              name="debitAccountNo"
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
                setDataObject({
                  ...dataObject,
                  individuals: !e.target.checked,
                });
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

          {/* LOGO */}
          <div
            className={`${classes.logoContainer} ${classes.div14} flexCenterColumn`}
          >
            <img ref={logoImgRef} src="/organization.svg" alt="organization" />
            <span
              onClick={(e) => {
                e.preventDefault();
                logoInputRef.current.click();
              }}
            >
              {language.changeLogo[currentLanguage]}
            </span>
            <input
              ref={logoInputRef}
              type="file"
              multiple={false}
              accept=".jpg,.jpeg,.png,.svg"
              name="logo"
              onChange={(e) => {
                const url = URL.createObjectURL(e.target.files[0]);
                logoImgRef.current.src = url;
                handleBase64Convert(e.target.files[0]);
              }}
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
    </>
  );
}
