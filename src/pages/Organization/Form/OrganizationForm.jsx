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
import LabelInput from "../../../components/LabelInput/LabelInput";
import LabelSelect from "../../../components/LabelSelect/LabelSelect";

export default function OrganizationForm2() {
  //init
  const currentLanguage = useContext(LanguageContext);
  // states
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(false);
  const [governorates, setGovernorates] = useState([]);
  const [areas, setAreas] = useState([]);
  const [titles, setTitles] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [initListsFetched, setInitListsFetched] = useState(false);
  const [formData, setFormData] = useState({
    organizationCode: "",
    name: "",
    address: "",
    enName: "",
    governorate: 0,
    area: 0,
    courtesy: 0,
    keyperson: "",
    individuals: true,
    defaultCurrency: 0,
    debitProfitCenter: "",
    debitAccountNo: "",
    secUserAccountID: 0,
    logo: "",
    savedToFMIS: true,
  });

  // Refs
  const containerRef = useRef();

  // Handlers
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  // Fetching Data
  const gatherData = async () => {
    try {
      setLoading(true);
      // Curruencies
      if (currencies.length < 1) {
        const fetchedCurrs = await fetchFromApi(
          "V1/CodesRouting/CurrnciesList",
          "GET"
        );
        const formatted = fetchedCurrs.data.data.map((x) => {
          return {
            value: x.id,
            labelAr: x.currncueiesEn,
            labelEn: x.currncueiesEn,
          };
        });
        setCurrencies(formatted);
      }

      // Titles
      if (titles.length < 1) {
        const fetchedTitles = await fetchFromApi(
          "V1/CodesRouting/courtesyTitleList",
          "GET"
        );
        const formatted = fetchedTitles.data.data.map((x) => {
          return {
            value: x.id,
            labelAr: x.courtesyAr,
            labelEn: x.courtesyEn,
          };
        });
        setTitles(formatted);
      }

      // Governorates
      if (governorates.length < 1) {
        const fetchedGovernorates = await fetchFromApi(
          "V1/CodesRouting/GovernateList",
          "GET"
        );
        const formatted = fetchedGovernorates.data.data.map((x) => {
          return {
            value: x.id,
            labelAr: x.arabicName,
            labelEn: x.englishName,
          };
        });
        setGovernorates(formatted);
      }

      // Areas
      const fetchedAreas = await fetchFromApi(
        `V1/CodesRouting/AreaList/${formData.governorate || 1}`,
        "GET"
      );
      const formatted = fetchedAreas.data.data.map((x) => {
        return {
          value: x.id,
          labelAr: x.arabicName,
          labelEn: x.englishName,
        };
      });
      setAreas(formatted);

      setInitListsFetched(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast(language.internalError[currentLanguage]);
    }
  };

  // Effect
  useEffect(() => {
    if (!initListsFetched) {
      gatherData();
    }
    if (governorates.length > 0) {
      // Areas
      const fetchedAreas = fetchFromApi(
        `V1/CodesRouting/AreaList/${formData.governorate || 1}`,
        "GET"
      )
        .then((response) => {
          const formatted = response.data.data.map((x) => {
            return {
              value: x.id,
              labelAr: x.arabicName,
              labelEn: x.englishName,
            };
          });
          setAreas(formatted);
        })
        .catch((err) => {
          handleErrors(err);
        });
    }
    setLoading(false);
  }, [formData.governorate]);

  return (
    <>
      {loading ? <Loading /> : null}
      <div ref={containerRef} className={`${classes.container}`}>
        <form className={`${classes.form}`}>
          {/* ************** Name in english ************* */}
          <LabelInput
            inputDefaultValue={formData.enName}
            isDisabled={viewMode}
            // ref={usernameRef}
            containerCSS={`${classes.div1}`}
            inputName={"enName"}
            labelLanguageObject={{
              en: "Name in english",
              ar: "الأسم باللغة الإنجليزية",
            }}
            onChangeFunction={handleChange}
          />

          {/* ************** Name in arabic ************* */}
          <LabelInput
            inputDefaultValue={formData.name}
            isDisabled={viewMode}
            // ref={usernameRef}
            containerCSS={`${classes.div2}`}
            inputName={"name"}
            labelLanguageObject={{
              en: "Name in arabic",
              ar: "الأسم باللغة العربية",
            }}
            onChangeFunction={handleChange}
          />

          {/* ************** Code ************* */}
          <LabelInput
            inputDefaultValue={formData.organizationCode}
            isDisabled={viewMode}
            // ref={usernameRef}
            containerCSS={`${classes.div3}`}
            inputName={"organizationCode"}
            labelLanguageObject={{
              en: "Code",
              ar: "الكود",
            }}
            onChangeFunction={handleChange}
          />

          {/* ************** Governorate ************* */}
          <LabelSelect
            selectDefaultValue={formData.governorate}
            isDisabled={viewMode}
            // ref={groupRef}
            containerCSS={`${classes.div4}`}
            selectName={"governorate"}
            onChangeFunction={handleChange}
            options={governorates}
            labelLanguageObject={{
              en: "Governorate",
              ar: "المحافظة",
            }}
          />

          {/* ************** Areas ************* */}
          <LabelSelect
            selectDefaultValue={formData.area}
            isDisabled={viewMode}
            // ref={groupRef}
            containerCSS={`${classes.div5}`}
            selectName={"area"}
            onChangeFunction={handleChange}
            options={areas}
            labelLanguageObject={{
              en: "Area",
              ar: "النطاق",
            }}
          />
        </form>
      </div>
    </>
  );
}

//! Build this again

// import { useNavigate, useParams } from "react-router-dom";
// import { setPageTitle } from "../../../utilities/titles";
// import { useContext, useEffect, useRef, useState } from "react";
// import classes from "./OrganizationForm.module.css";
// import { language } from "../../../utilities/language";
// import { LanguageContext } from "../../../App";
// import { fetchFromApi } from "../../../api/fetcher";
// import toast from "react-hot-toast";
// import Loading from "../../../components/Loading/Loading";
// import { handleErrors } from "../../../utilities/errors";

// export default function OrganizationForm() {
//   const currentLanguage = useContext(LanguageContext);
//   const containerRef = useRef();
//   const navigate = useNavigate();

//   const params = useParams();

//   const [editMode, setEditMode] = useState(params.id ? true : false);
//   const [objectEdited, setObjectEditied] = useState(false);

//   let title = editMode
//     ? language.editOrganization
//     : language.addNewOrganization;
//   setPageTitle(title.en, title.ar);

//   const [dataObject, setDataObject] = useState({
//     organizationCode: "",
//     name: "",
//     address: "",
//     enName: "",
//     governorate: 0,
//     area: 0,
//     courtesy: 0,
//     keyperson: "",
//     individuals: true,
//     defaultCurrency: 0,
//     debitProfitCenter: "",
//     debitAccountNo: "",
//     secUserAccountID: 0,
//     logo: "",
//     savedToFMIS: true,
//   });

//   const [loading, setLoading] = useState(true);
//   const [governorates, setGovernorates] = useState([]);
//   const [areas, setAreas] = useState([]);
//   const [titles, setTitles] = useState([]);
//   const [currencies, setCurrencies] = useState([]);

//   const governorateRef = useRef();
//   const areaRef = useRef();
//   const courtesyRef = useRef();
//   const currencyRef = useRef();
//   const logoInputRef = useRef();
//   const logoImgRef = useRef();

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setDataObject({ ...dataObject, [name]: value });
//   };

//   const gatherData = async () => {
//     try {
//       setLoading(true);
//       // Curruencies
//       if (currencies.length < 1) {
//         const fetchedCurrs = await fetchFromApi(
//           "V1/CodesRouting/CurrnciesList",
//           "GET"
//         );
//         setCurrencies(fetchedCurrs.data.data);
//       }

//       // Titles
//       if (titles.length < 1) {
//         const fetchedTitles = await fetchFromApi(
//           "V1/CodesRouting/courtesyTitleList",
//           "GET"
//         );
//         setTitles(fetchedTitles.data.data);
//       }

//       // Governorates
//       if (governorates.length < 1) {
//         const fetchedGovernorates = await fetchFromApi(
//           "V1/CodesRouting/GovernateList",
//           "GET"
//         );
//         setGovernorates(fetchedGovernorates.data.data);
//       }

//       // // Areas
//       // const fetchedAreas = await fetchFromApi(
//       //   `V1/CodesRouting/AreaList/${dataObject.governorate || 1}`,
//       //   "GET"
//       // );
//       // setAreas(fetchedAreas.data.data);

//       setLoading(false);
//     } catch (error) {
//       toast(language.internalError[currentLanguage]);
//     }
//   };

//   const fetchAreas = async () => {
//     // Areas
//     const fetchedAreas = await fetchFromApi(
//       `V1/CodesRouting/AreaList/${dataObject.governorate || 1}`,
//       "GET"
//     );
//     setAreas(fetchedAreas.data.data);
//   };

//   const handleBase64Convert = (file) => {
//     const reader = new FileReader();

//     reader.readAsDataURL(file);

//     reader.onload = () => {
//       let base64String = reader.result;
//       let comaIndex = base64String.indexOf(",");
//       base64String = base64String.substring(comaIndex + 1, base64String.length);
//       setDataObject({ ...dataObject, logo: base64String });
//     };
//   };

//   const handleSubmit = (e) => {
//     if (editMode) {
//       setLoading(true);
//       e.preventDefault();
//       dataObject.governorate = +governorateRef.current.value;
//       dataObject.area = +areaRef.current.value;
//       dataObject.courtesy = +courtesyRef.current.value;
//       dataObject.defaultCurrency = +currencyRef.current.value;
//       fetchFromApi("V1/Organization/Organization/Edit", "POST", dataObject)
//         .then(() => {
//           setLoading(false);
//           toast.success(language.editedSuccessfully[currentLanguage]);
//           navigate("/medilight/client/organization");
//         })
//         .catch((err) => {
//           handleErrors(err);
//           setLoading(false);
//         });
//     } else {
//       setLoading(true);
//       e.preventDefault();
//       dataObject.governorate = +governorateRef.current.value;
//       dataObject.area = +areaRef.current.value;
//       dataObject.courtesy = +courtesyRef.current.value;
//       dataObject.defaultCurrency = +currencyRef.current.value;
//       fetchFromApi("V1/Organization/Organization/Create", "POST", dataObject)
//         .then(() => {
//           setLoading(false);
//           toast.success(language.addedSuccessfully[currentLanguage]);
//           navigate("/medilight/client/organization");
//         })
//         .catch((err) => {
//           handleErrors(err);
//           setLoading(false);
//         });
//     }
//   };

//   const fillData = async (id) => {
//     try {
//     } catch (error) {
//       handleErrors(error);
//     }
//   };

//   useEffect(() => {
//     gatherData();
//     if (editMode && !objectEdited) {
//       // fillData(params.id);
//     }
//     // }, []);
//   }, [dataObject?.governorate]);

//   return (
//     <>
//       {loading ? <Loading /> : null}
//       <div ref={containerRef} className={`${classes.container}`}>
//         <span className={`${classes.title}`}>
//           {editMode
//             ? language.editOrganization[currentLanguage]
//             : language.addNewOrganization[currentLanguage]}
//         </span>
//         <form className={`${classes.form}`}>
//           {/* NAME */}
//           <div className={`${classes.wrapper} ${classes.div1}`}>
//             <label htmlFor="orgName">{language.nameAr[currentLanguage]}</label>
//             <input
//               spellCheck={false}
//               name="name"
//               onChange={handleChange}
//               type="text"
//               id="orgName"
//               value={dataObject.name}
//             />
//           </div>
//           {/* ------------------------------------ */}
//           {/* English Name */}
//           <div className={`${classes.wrapper} ${classes.div2}`}>
//             <label htmlFor="orgEngName">
//               {language.nameEn[currentLanguage]}
//             </label>
//             <input
//               spellCheck={false}
//               name="enName"
//               onChange={handleChange}
//               type="text"
//               id="orgEngName"
//               value={dataObject.enName}
//             />
//           </div>
//           {/* ------------------------------------ */}
//           {/* Code */}
//           <div className={`${classes.wrapper} ${classes.div3}`}>
//             <label htmlFor="orgCode">{language.code[currentLanguage]}</label>
//             <input
//               spellCheck={false}
//               name="organizationCode"
//               onChange={handleChange}
//               type="text"
//               id="orgCode"
//               value={dataObject.organizationCode}
//             />
//           </div>
//           {/* ------------------------------------ */}
//           {/* Governorates */}
//           <div className={`${classes.wrapper} ${classes.div4}`}>
//             <label htmlFor="orgGovernorates">
//               {language.governorate[currentLanguage]}
//             </label>
//             <select
//               ref={governorateRef}
//               onChange={(e) => {
//                 handleChange(e);
//                 fetchAreas();
//               }}
//               name="governorate"
//               id="orgGovernorates"
//               value={dataObject.governorate}
//             >
//               {governorates.map((gov) => {
//                 return (
//                   <option key={gov.id} value={gov.id}>
//                     {currentLanguage == "ar" ? gov.arabicName : gov.englishName}
//                   </option>
//                 );
//               })}
//             </select>
//           </div>
//           {/* ------------------------------------ */}

//           {/* Areas */}
//           <div className={`${classes.wrapper} ${classes.div5}`}>
//             <label htmlFor="orgAreas">{language.area[currentLanguage]}</label>
//             <select
//               ref={areaRef}
//               onChange={handleChange}
//               name="area"
//               id="orgAreas"
//               value={dataObject.area}
//             >
//               {areas.map((area) => {
//                 return (
//                   <option key={area.id} value={area.id}>
//                     {currentLanguage == "ar"
//                       ? area.arabicName
//                       : area.englishName}
//                   </option>
//                 );
//               })}
//             </select>
//           </div>
//           {/* ------------------------------------ */}
//           {/* Address */}
//           <div className={`${classes.wrapper} ${classes.div6}`}>
//             <label htmlFor="orgAddress">
//               {language.address[currentLanguage]}
//             </label>
//             <input
//               spellCheck={false}
//               name="address"
//               onChange={handleChange}
//               type="text"
//               id="orgAddress"
//             />
//           </div>
//           {/* ------------------------------------ */}
//           {/* Key Person */}
//           <div className={`${classes.wrapper} ${classes.div7}`}>
//             <label htmlFor="orgKeyPerson">
//               {language.keyPerson[currentLanguage]}
//             </label>
//             <input
//               spellCheck={false}
//               name="keyperson"
//               onChange={handleChange}
//               type="text"
//               id="orgKeyPerson"
//             />
//           </div>
//           {/* ------------------------------------ */}
//           {/* Titles */}
//           <div className={`${classes.wrapper} ${classes.div8}`}>
//             <label htmlFor="orgTitles">
//               {language.titleName[currentLanguage]}
//             </label>
//             <select
//               ref={courtesyRef}
//               onChange={handleChange}
//               name="courtesy"
//               id="orgTitles"
//             >
//               {titles.map((title) => {
//                 return (
//                   <option key={title.id} value={title.id}>
//                     {currentLanguage == "ar"
//                       ? title.courtesyAr
//                       : title.courtesyEn}
//                   </option>
//                 );
//               })}
//             </select>
//           </div>
//           {/* ------------------------------------ */}
//           {/* Job */}
//           <div className={`${classes.wrapper} ${classes.div9}`}>
//             <label htmlFor="orgJob">{language.job[currentLanguage]}</label>
//             <input
//               spellCheck={false}
//               name="job"
//               onChange={handleChange}
//               type="text"
//               id="orgJob"
//             />
//           </div>
//           {/* ------------------------------------ */}

//           {/* Currency */}
//           <div className={`${classes.wrapper} ${classes.div10}`}>
//             <label htmlFor="orgCurrency">
//               {language.defaultCurrency[currentLanguage]}
//             </label>
//             <select
//               ref={currencyRef}
//               onChange={handleChange}
//               name="defaultCurrency"
//               id="orgCurrency"
//             >
//               {currencies.map((curr, index) => {
//                 return (
//                   <option key={index + 1} value={curr.id}>
//                     {currentLanguage == "ar"
//                       ? curr.currncueiesAr
//                       : curr.currncueiesEn}
//                   </option>
//                 );
//               })}
//             </select>
//           </div>

//           {/* ------------------------------------ */}

//           {/* Debit Account Number */}
//           <div className={`${classes.wrapper} ${classes.div11}`}>
//             <label htmlFor="orgDebitAcoountNumber">
//               {language.debitAccountNumber[currentLanguage]}
//             </label>
//             <input
//               spellCheck={false}
//               name="debitAccountNo"
//               onChange={handleChange}
//               type="text"
//               id="orgDebitAcoountNumber"
//             />
//           </div>
//           {/* ------------------------------------ */}
//           {/* Debit Profit Center */}
//           <div className={`${classes.wrapper} ${classes.div12}`}>
//             <label htmlFor="orgDebitProfitCenter">
//               {language.debitProfitCenter[currentLanguage]}
//             </label>
//             <input
//               spellCheck={false}
//               name="debitProfitCenter"
//               onChange={handleChange}
//               type="text"
//               id="orgDebitProfitCenter"
//             />
//           </div>
//           {/* ------------------------------------ */}
//           {/* Agent */}
//           <div className={`${classes.wrapper} ${classes.div13}`}>
//             <label htmlFor="orgAgent">
//               {language.orgAgent[currentLanguage]}
//             </label>
//             <input
//               spellCheck={false}
//               name="secUserAccountID"
//               onChange={handleChange}
//               type="text"
//               id="orgAgent"
//             />
//           </div>
//           {/* ------------------------------------ */}
//           {/* Type */}
//           <div
//             className={`${classes.wrapper} ${classes.typeChecbox} ${classes.div14}`}
//           >
//             <label htmlFor="orgType">
//               {language.isOrganization[currentLanguage]}
//             </label>
//             <input
//               spellCheck={false}
//               name="individuals"
//               onChange={(e) => {
//                 setDataObject({
//                   ...dataObject,
//                   individuals: !e.target.checked,
//                 });
//               }}
//               type="checkbox"
//               id="orgType"
//             />
//           </div>
//           {/* ------------------------------------ */}

//           {/* LOGO */}
//           <div
//             className={`${classes.logoContainer} ${classes.div15} flexCenterColumn`}
//           >
//             <img ref={logoImgRef} src="/organization.svg" alt="organization" />
//             <span
//               onClick={(e) => {
//                 e.preventDefault();
//                 logoInputRef.current.click();
//               }}
//             >
//               {language.changeLogo[currentLanguage]}
//             </span>
//             <input
//               ref={logoInputRef}
//               type="file"
//               multiple={false}
//               accept=".jpg,.jpeg,.png,.svg"
//               name="logo"
//               onChange={(e) => {
//                 const url = URL.createObjectURL(e.target.files[0]);
//                 logoImgRef.current.src = url;
//                 handleBase64Convert(e.target.files[0]);
//               }}
//             />
//           </div>
//           {/* ------------------------------------ */}

//           {/* Submit Button */}
//           <button
//             onClick={handleSubmit}
//             className={`${classes.div16} ${classes.button}`}
//             formAction="submit"
//           >
//             {editMode
//               ? language.edit[currentLanguage]
//               : language.add[currentLanguage]}
//           </button>
//         </form>
//       </div>
//     </>
//   );
// }
