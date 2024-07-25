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
  //! init
  const currentLanguage = useContext(LanguageContext);
  const params = useParams();
  const navigate = useNavigate();
  //! states
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDataFilled, setEditDataFilled] = useState(false);
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
    job: "",
    individuals: true,
    defaultCurrency: 0,
    debitProfitCenter: "",
    debitAccountNo: "",
    secUserAccountID: 0,
    logo: "",
    savedToFMIS: true,
  });

  //! Refs
  const containerRef = useRef();
  const logoImgRef = useRef();
  const logoInputRef = useRef();
  const courtesyRef = useRef();
  const governorateRef = useRef();
  const areaRef = useRef();
  const currencyRef = useRef();
  const indevidualRef = useRef();

  //! Handlers
  const handleChange = async (event) => {
    const { name, value } = event.target;
    // checking for governorate so areas would be updated
    if (name == "governorate") {
      await fetchAreas(value);
    }
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = () => {};

  //! Fetching Data
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
        await fetchAreas(1);
        setGovernorates(formatted);
      }

      setInitListsFetched(true);
      setLoading(false);
    } catch (error) {
      toast(language.internalError[currentLanguage]);
    }
  };

  const fetchAndFillUserData = async () => {
    if (!params.id) {
      return toast.error(language.internalError[currentLanguage]);
    }
    fetchFromApi(
      `V1/Organization/Organization/SearchOrg?id=${params.id}`,
      "GET"
    )
      .then(async (response) => {
        if (response?.data?.data?.data?.length < 1) {
          toast.error(language.invalidID[currentLanguage]);
          return navigate("/medilight/client/organization");
        }
        const record = response?.data?.data?.data[0];
        setFormData({
          organizationCode: record.organizationCode,
          name: record.name,
          address: record.address,
          enName: record.enName,
          courtesy: record.courtesy,
          keyperson: record.keyperson,
          job: record.job,
          individuals: record.individuals,
          defaultCurrency: record.defaultCurrency,
          debitProfitCenter: record.debitProfitCenter,
          debitAccountNo: record.debitAccountNo,
          secUserAccountID: record.secUserAccountID,
          logo: record.logo,
          savedToFMIS: record.savedToFMIS,
          governorate: record.governorate,
          area: record.area,
        });
        // filling select element using refs
        governorateRef.current.children[1].value = record.governorate;
        courtesyRef.current.children[1].value = record.courtesy;
        currencyRef.current.children[1].value = record.defaultCurrency;
        await fetchAreas(record.governorate);
        setEditDataFilled(true);
      })
      .catch((err) => {
        handleErrors(err);
      });
  };

  const fetchAreas = async (govId) => {
    // Areas
    const fetchedAreas = await fetchFromApi(
      `V1/CodesRouting/AreaList/${govId}`,
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
  };

  //! Init Function
  const initFunction = async () => {
    if (!initListsFetched) {
      await gatherData();
    }

    // Checking for modes
    const paramsString = params["*"];
    if (paramsString.includes("view")) {
      setViewMode(true);
    } else if (paramsString.includes("edit")) {
      setEditMode(true);
      if (!editDataFilled) {
        await fetchAndFillUserData();
      }
      areaRef.current.children[1].value = formData.area;
      setLoading(false);
    }
  };

  //! Effect
  useEffect(() => {
    initFunction();
  }, [editDataFilled, initListsFetched]);

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
          {governorates.length > 0 ? (
            <LabelSelect
              selectDefaultValue={formData.governorate}
              isDisabled={viewMode}
              ref={governorateRef}
              containerCSS={`${classes.div4}`}
              selectName={"governorate"}
              onChangeFunction={handleChange}
              options={governorates}
              labelLanguageObject={{
                en: "Governorate",
                ar: "المحافظة",
              }}
            />
          ) : null}

          {/* ************** Areas ************* */}
          {initListsFetched ? (
            <LabelSelect
              selectDefaultValue={formData.area}
              isDisabled={viewMode}
              ref={areaRef}
              containerCSS={`${classes.div5}`}
              selectName={"area"}
              onChangeFunction={handleChange}
              options={areas}
              labelLanguageObject={{
                en: "Area",
                ar: "النطاق",
              }}
            />
          ) : null}
          {/* ************** Address ************* */}
          <LabelInput
            inputDefaultValue={formData.address}
            isDisabled={viewMode}
            // ref={usernameRef}
            containerCSS={`${classes.div6}`}
            inputName={"address"}
            labelLanguageObject={{
              en: "Address",
              ar: "العنوان",
            }}
            onChangeFunction={handleChange}
          />

          {/* ************** Key Person ************* */}
          <LabelInput
            inputDefaultValue={formData.keyperson}
            isDisabled={viewMode}
            // ref={usernameRef}
            containerCSS={`${classes.div7}`}
            inputName={"keyperson"}
            labelLanguageObject={{
              en: "Key Person",
              ar: "ممثل الجهة",
            }}
            onChangeFunction={handleChange}
          />

          {/* ************** Courtesies ************* */}
          <LabelSelect
            selectDefaultValue={formData.courtesy}
            isDisabled={viewMode}
            ref={courtesyRef}
            containerCSS={`${classes.div8}`}
            selectName={"courtesy"}
            onChangeFunction={handleChange}
            options={titles}
            labelLanguageObject={{
              en: "Courtesy",
              ar: "المسمى الوظيفى",
            }}
          />

          {/* ************** Job ************* */}
          <LabelInput
            inputDefaultValue={formData.job}
            isDisabled={viewMode}
            // ref={usernameRef}
            containerCSS={`${classes.div9}`}
            inputName={"job"}
            labelLanguageObject={{
              en: "Job",
              ar: "الوظيفة",
            }}
            onChangeFunction={handleChange}
          />

          {/* ************** Currencies ************* */}
          <LabelSelect
            selectDefaultValue={formData.defaultCurrency}
            isDisabled={viewMode}
            ref={currencyRef}
            containerCSS={`${classes.div10}`}
            selectName={"defaultCurrency"}
            onChangeFunction={handleChange}
            options={currencies}
            labelLanguageObject={{
              en: "Default Currency",
              ar: "العملة الإفتراضية",
            }}
          />

          {/* **************  Debit Account Number ************* */}
          <LabelInput
            inputDefaultValue={formData.debitAccountNo}
            isDisabled={viewMode}
            // ref={usernameRef}
            containerCSS={`${classes.div11}`}
            inputName={"debitAccountNo"}
            labelLanguageObject={{
              en: "Debit Account Number",
              ar: "رقم حساب المدين",
            }}
            onChangeFunction={handleChange}
          />

          {/* **************  Debit Profit Center ************* */}
          <LabelInput
            inputDefaultValue={formData.debitProfitCenter}
            isDisabled={viewMode}
            // ref={usernameRef}
            containerCSS={`${classes.div12}`}
            inputName={"debitProfitCenter"}
            labelLanguageObject={{
              en: "Debit Profit Center",
              ar: "مركز أرباح المدين",
            }}
            onChangeFunction={handleChange}
          />

          {/* **************  Key Person Id ************* */}
          <LabelInput
            inputDefaultValue={formData.secUserAccountID}
            isDisabled={viewMode}
            // ref={usernameRef}
            containerCSS={`${classes.div13}`}
            inputName={"secUserAccountID"}
            labelLanguageObject={{
              en: "User ID",
              ar: "الرقم التعريفى للعميل",
            }}
            onChangeFunction={handleChange}
          />

          {/* **************  Type ************* */}
          <div
            className={`${classes.wrapper} ${classes.typeChecbox} ${classes.div14}`}
          >
            <label htmlFor="orgType">
              {language.isOrganization[currentLanguage]}
            </label>
            <input
              spellCheck={false}
              name="individuals"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  individuals: !e.target.checked,
                });
              }}
              type="checkbox"
              id="orgType"
              disabled={viewMode}
            />
          </div>

          {/* **************  LOGO ************* */}
          <div
            className={`${classes.logoContainer} ${classes.div15} flexCenterColumn`}
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

          {/* **************  Submit Button ************* */}
          {viewMode ? null : (
            <button
              onClick={handleSubmit}
              className={`${classes.div16} ${classes.button}`}
              formAction="submit"
            >
              {editMode
                ? language.edit[currentLanguage]
                : language.add[currentLanguage]}
            </button>
          )}
        </form>
      </div>
    </>
  );
}
