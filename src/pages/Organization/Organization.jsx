import { useNavigate, useParams } from "react-router-dom";
import { setPageTitle } from "../../titles";
import { useContext, useEffect, useRef, useState } from "react";
import classes from "./Organization.module.css";
import { language } from "../../language";
import { LanguageContext } from "../../App";
import { fetchFromApi } from "../../api/fetcher";
import toast from "react-hot-toast";
import Loading from "../../components/Loading/Loading";

export default function Organization() {
  setPageTitle("Create New Organization", "إنشاء منظمة جديدة");

  const currentLanguage = useContext(LanguageContext);

  const params = useParams();
  const [editMode, setEditMode] = useState(params.id ? true : false);
  const [dataObject, setDataObject] = useState({ individuals: true });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    dataObject.governorate = +governorateRef.current.value;
    dataObject.area = +areaRef.current.value;
    dataObject.courtesy = +courtesyRef.current.value;
    dataObject.currency = currencyRef.current.value;
    //! CHECKBOX
    console.log(dataObject);
  };

  useEffect(() => {
    gatherData();
  }, [dataObject?.governorate]);

  const navigate = useNavigate();
  return (
    <>
      {loading ? <Loading /> : null}
      <h1
        onClick={() => {
          navigate("add");
        }}
      >
        ADD
      </h1>
      <h1
        onClick={() => {
          navigate("edit/5");
        }}
      >
        EDIT
      </h1>
      <h2>DATA</h2>
    </>
  );
}
