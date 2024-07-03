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

export default function DataTable({
  fetchFunction,
  columnsObject,
  editUrl,
  deleteUrl,
  deleteMessageObject,
}) {
  const navigate = useNavigate();
  const currentLanguage = useContext(LanguageContext);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const retriveData = async () => {
    const res = await fetchFunction(pageNumber, pageSize);
    setData(res.data.data);
  };

  const deleteOrganization = () => {
    setLoading(true);
    let id = showModal;
    fetchFromApi(`${deleteUrl}/${id}`, "POST")
      .then(async () => {
        setShowModal(false);
        setLoading(false);
        await retriveData();
        toast.success(language.deletedSuccessfully[currentLanguage]);
      })
      .catch((err) => {
        setLoading(false);
        handleErrors(err);
      });
  };

  useEffect(() => {
    retriveData();
  }, [currentLanguage]);
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
      <div className={`${classes.search}`}>SEARCH</div>
      <div className={`${classes.tableContainer} scroll`}>
        <ul className={`${classes.table}`}>
          <li className={`${classes.titles}`}>
            <span className={`${classes.numbers}`}>#</span>
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
                  <li key={record.id ? record.id : index + 1}>
                    <span className={`${classes.numbers}`}>{index + 1}</span>
                    {Object.keys(columnsObject).map((column) => {
                      if (columnsObject[column].skip) {
                        return;
                      }
                      // checking for edit
                      if (column == "edit") {
                        return (
                          <span
                            style={{
                              width: `${columnsObject[column].widthPercentage}%`,
                            }}
                          >
                            <button
                              className={`${classes.edit}`}
                              onClick={() => {
                                navigate(`${editUrl}/${record.id}`);
                              }}
                            >
                              {columnsObject[column][currentLanguage]}
                            </button>
                          </span>
                        );
                      }
                      // checking for delete
                      if (column == "delete") {
                        return (
                          <span
                            style={{
                              width: `${columnsObject[column].widthPercentage}%`,
                            }}
                          >
                            <button
                              className={`${classes.delete}`}
                              onClick={() => {
                                setShowModal(record.id);
                              }}
                            >
                              {columnsObject[column][currentLanguage]}
                            </button>
                          </span>
                        );
                      }
                      return (
                        <span
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
      <div className={`${classes.pages}`}>Pages</div>
    </div>
  );
}
