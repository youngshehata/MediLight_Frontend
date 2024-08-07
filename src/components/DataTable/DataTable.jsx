import { useContext, useState } from "react";
import classes from "./DataTable.module.css";
import { useEffect } from "react";
import { LanguageContext } from "../../App";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { language } from "../../utilities/language";
import { fetchFromApi } from "../../api/fetcher";
import { handleErrors } from "../../utilities/errors";
import toast from "react-hot-toast";
import Loading from "../Loading/Loading";
import Auth from "../Auth/Auth";

export default function DataTable({
  fetchFunction,
  columnsObject,
  editUrl,
  editRole,
  deleteRole,
  deleteMessageObject,
  addNewLanguageObject,
  addNewUrl,
  addRole,
  viewUrl,
  deleteFunction,
}) {
  const navigate = useNavigate();
  const currentLanguage = useContext(LanguageContext);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pages, setPages] = useState({
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    pageSize: 10,
    totalCount: 10,
    totalPages: 1,
  });

  const handlePageChange = (responseData) => {
    setPages({
      currentPage: responseData.currentPage,
      hasNextPage: responseData.hasNextPage,
      hasPreviousPage: responseData.hasPreviousPage,
      pageSize: responseData.pageSize,
      totalCount: responseData.totalCount,
      totalPages: responseData.totalPages,
    });
  };

  const goToNextPage = async () => {
    if (!pages.hasNextPage) {
      return toast.error(language.lastPageError[currentLanguage]);
    }
    const res = await fetchFunction(pages.currentPage + 1, pages.pageSize);
    handlePageChange(res);
    if (res.constructor === Array) {
      setData(res);
      return;
    } else if (res.data.constructor === Array) {
      setData(res.data);
      return;
    }
  };

  const goToPreviousPage = async () => {
    if (!pages.hasPreviousPage) {
      return toast.error(language.firstPageError[currentLanguage]);
    }
    const res = await fetchFunction(pages.currentPage - 1, pages.pageSize);
    handlePageChange(res);
    if (res.constructor === Array) {
      setData(res);
      return;
    } else if (res.data.constructor === Array) {
      setData(res.data);
      return;
    }
  };

  const goToFirstPage = async () => {
    if (!pages.hasPreviousPage) {
      return toast.error(language.firstPageError[currentLanguage]);
    }
    const res = await fetchFunction(1, pages.pageSize);
    handlePageChange(res);
    if (res.constructor === Array) {
      setData(res);
      return;
    } else if (res.data.constructor === Array) {
      setData(res.data);
      return;
    }
  };

  const goToLastPage = async () => {
    if (!pages.hasNextPage) {
      return toast.error(language.lastPageError[currentLanguage]);
    }
    const res = await fetchFunction(pages.totalPages, pages.pageSize);
    handlePageChange(res);
    if (res.constructor === Array) {
      setData(res);
      return;
    } else if (res.data.constructor === Array) {
      setData(res.data);
      return;
    }
  };

  const handlePageCountChange = (event) => {
    setPages({ ...pages, pageSize: parseInt(event.target.value) });
  };

  const retriveData = async () => {
    const res = await fetchFunction(pages.currentPage, pages.pageSize);
    handlePageChange(res);
    if (res.constructor === Array) {
      setData(res);
      setLoading(false);
      return;
    } else if (res.data.constructor === Array) {
      setData(res.data);
      setLoading(false);
      return;
    }
  };

  const deleteOrganization = async () => {
    let id = showModal;
    try {
      const response = await deleteFunction(id);
      if (response) {
        setShowModal(false);
        await retriveData();
      }
    } catch (error) {}
  };

  useEffect(() => {
    retriveData();
  }, [currentLanguage, pages.pageSize]);
  return (
    <div className={`${classes.gridContainer}`}>
      {loading ? <Loading /> : null}
      {showModal ? (
        <Modal
          message={deleteMessageObject[currentLanguage]}
          noFunction={() => {
            setShowModal(false);
          }}
          noText={language.cancel[currentLanguage]}
          title={language.warning[currentLanguage]}
          type={"warning"}
          yesText={language.confirm[currentLanguage]}
          yesFunction={deleteOrganization}
        />
      ) : null}

      <div className={`${classes.search}`}>
        <Auth
          authRole={addRole}
          componentJSX={
            <div
              className={`${classes.addNewButton}`}
              onClick={() => {
                navigate(addNewUrl);
              }}
            >
              <span>{addNewLanguageObject[currentLanguage]}</span>
              <img src="/whitePlus.svg" alt="add" />
            </div>
          }
        />
      </div>
      <div className={`${classes.tableContainer} scroll`}>
        <ul className={`${classes.table}`}>
          <li key={333} className={`${classes.titles}`}>
            <span key={444} className={`${classes.numbers}`}>
              #
            </span>
            {Object.keys(columnsObject).map((column, index) => {
              if (columnsObject[column].skip) {
                return;
              }
              return (
                <span
                  key={index + 1}
                  style={{ width: `${columnsObject[column].widthPercentage}%` }}
                >
                  {currentLanguage == "ar"
                    ? columnsObject[column].ar
                    : columnsObject[column].en}
                </span>
              );
            })}
          </li>
          {data
            ? data.map((record, index) => {
                return (
                  <li key={index + 1}>
                    <span key={"963"} className={`${classes.numbers}`}>
                      {pages.currentPage * pages.pageSize -
                        pages.pageSize +
                        (index + 1)}
                      {/* <div className={`${classes.viewDiv} flexCenterColumn`}> */}
                      <div
                        onClick={() => {
                          console.log(`${viewUrl}/${record.id}`);
                          navigate(`${viewUrl}/${record.id}`);
                        }}
                        className={
                          currentLanguage == "ar"
                            ? `${classes.viewDiv} ${classes.viewRecordEyeAr}`
                            : `${classes.viewDiv} ${classes.viewRecordEyeEn}`
                        }
                      >
                        <img
                          className={
                            currentLanguage == "ar"
                              ? `${classes.viewRecordEye}`
                              : `${classes.viewRecordEye}`
                          }
                          src="/details.svg"
                          alt="show"
                        />
                        <span>{language.details[currentLanguage]}</span>
                      </div>
                    </span>
                    {Object.keys(columnsObject).map((column, index) => {
                      if (columnsObject[column].skip) {
                        return;
                      }
                      // checking for edit
                      if (column == "edit") {
                        return (
                          <span
                            key={index + 1}
                            style={{
                              width: `${columnsObject[column].widthPercentage}%`,
                            }}
                          >
                            <Auth
                              authRole={editRole}
                              componentJSX={
                                <button
                                  className={`${classes.edit}`}
                                  onClick={() => {
                                    navigate(`${editUrl}/${record.id}`);
                                  }}
                                >
                                  {language.edit[currentLanguage]}
                                </button>
                              }
                            />
                          </span>
                        );
                      }
                      // checking for delete
                      if (column == "delete") {
                        return (
                          <span
                            key={index + 1}
                            style={{
                              width: `${columnsObject[column].widthPercentage}%`,
                            }}
                          >
                            <Auth
                              authRole={deleteRole}
                              componentJSX={
                                <button
                                  className={`${classes.delete}`}
                                  onClick={() => {
                                    setShowModal(record.id);
                                  }}
                                >
                                  {language.delete[currentLanguage]}
                                </button>
                              }
                            />
                          </span>
                        );
                      }
                      return (
                        <span
                          key={index + 1}
                          style={{
                            width: `${columnsObject[column].widthPercentage}%`,
                          }}
                        >
                          {record[column]}
                        </span>
                      );
                    })}
                  </li>
                );
              })
            : null}
        </ul>
      </div>
      <div className={`${classes.pages}`}>
        <div className={`${classes.pagesCount} flexCenterRow`}>
          <span>{language.resultsPerPage[currentLanguage]}</span>
          <select value={pages.pageSize} onChange={handlePageCountChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div
          className={
            currentLanguage == "ar"
              ? `${classes.pagesContainer} ${classes.pagesContainerAr}`
              : `${classes.pagesContainer} ${classes.pagesContainerEn}`
          }
        >
          <img
            className={`${classes.arrowImage} ${classes.endArrow}`}
            src="/endArrow.svg"
            alt="arrow"
            // onClick={goToLastPage}
            onClick={goToFirstPage}
          />
          <img
            className={`${classes.arrowImage} ${classes.sideArrowFirst}`}
            src="/sideArrow.svg"
            alt="arrow"
            onClick={goToPreviousPage}
            // onClick={goToNextPage}
          />
          <p
            className={`${classes.pagesNumbers}`}
          >{`${language.page[currentLanguage]} ${pages.currentPage} ${language.of[currentLanguage]} ${pages.totalPages}`}</p>
          <img
            className={`${classes.arrowImage} ${classes.sideArrowSecond}`}
            src="/sideArrow.svg"
            alt="arrow"
            // onClick={goToPreviousPage}
            onClick={goToNextPage}
          />
          <img
            className={`${classes.arrowImage} ${classes.endArrow}`}
            src="/endArrow.svg"
            alt="arrow"
            // onClick={goToFirstPage}
            onClick={goToLastPage}
          />
        </div>
        <div className={`${classes.totalResultsDiv} flexCenterRow`}>
          <span>{language.totalResults[currentLanguage]}</span>
          <span>{pages.totalCount}</span>
        </div>
      </div>
    </div>
  );
}
