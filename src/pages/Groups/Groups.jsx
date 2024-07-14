import { setPageTitle } from "../../utilities/titles";
import { useCallback, useContext, useEffect, useState } from "react";
import classes from "./Groups.module.css";
import { fetchFromApi } from "../../api/fetcher";
import Loading from "../../components/Loading/Loading";
import { handleErrors } from "../../utilities/errors";
import { language } from "../../utilities/language";
import { LanguageContext } from "../../App";
import SearchInput from "../../components/SearchInput/SearchInput";
import GroupsList from "./GroupsList";

export default function Groups() {
  setPageTitle("Create New Group", "إنشاء مجموعة جديدة");
  const [loading, setLoading] = useState(false);
  const currentLanguage = useContext(LanguageContext);

  const fetchAllGroups = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchFromApi(
        "V1/AuthorizationRouting/Roles/Role-List",
        "GET"
      );
      setLoading(false);
      return response?.data?.data;
    } catch (error) {
      setLoading(false);
      handleErrors(error);
    }
  }, []);

  // useEffect(() => {
  //   fetchAllGroups();
  // }, []);
  return (
    <>
      {loading ? <Loading /> : null}
      <div className={`${classes.container}`}>
        <section className={`${classes.groupsContainer}`}>
          <div className={`${classes.groupsTitle} flexCenterRow`}>
            <span>{language.groups[currentLanguage]}</span>
            <img src="/addWhite.svg" alt="add" />
          </div>
          <GroupsList fetchFunction={fetchAllGroups} />
        </section>
        <section className={`${classes.usersContainer}`}></section>
      </div>
    </>
  );
}
