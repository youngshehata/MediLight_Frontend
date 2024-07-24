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
    job: "",
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
  const logoImgRef = useRef();
  const logoInputRef = useRef();

  // Handlers
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
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
            // ref={groupRef}
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
            // ref={groupRef}
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
          <button
            onClick={handleSubmit}
            className={`${classes.div16} ${classes.button}`}
            formAction="submit"
          >
            CLICK
            {/* {editMode
              ? language.edit[currentLanguage]
              : language.add[currentLanguage]} */}
          </button>
        </form>
      </div>
    </>
  );
}
