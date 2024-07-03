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
          message={
            currentLanguage == "ar"
              ? "هل أنت متأكد من حذف هذه المنظمة؟"
              : "Are you sure you wanna delete this organization?"
          }
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
      <div>SEARCH</div>
      <div className={`${classes.tableContainer} scroll`}>
        <table className={`${classes.table}`}>
          <tr>
            {Object.keys(columnsObject).map((column) => {
              if (columnsObject[column].skip) {
                return;
              }
              return (
                <th
                  style={{ width: `${columnsObject[column].widthPercentage}%` }}
                >
                  {currentLanguage == "ar"
                    ? columnsObject[column].ar
                    : columnsObject[column].en}
                </th>
              );
            })}
          </tr>
          {data
            ? data.map((record, index) => {
                console.log(record);
                return (
                  <tr key={record.id ? record.id : index + 1}>
                    {Object.keys(columnsObject).map((column) => {
                      if (columnsObject[column].skip) {
                        return;
                      }
                      // checking for edit
                      if (column == "edit") {
                        return (
                          <td>
                            <button
                              onClick={() => {
                                navigate(`${editUrl}/${record.id}`);
                              }}
                            >
                              {columnsObject[column][currentLanguage]}
                            </button>
                          </td>
                        );
                      }
                      // checking for delete
                      if (column == "delete") {
                        return (
                          <td>
                            <button
                              onClick={() => {
                                setShowModal(record.id);
                              }}
                            >
                              {columnsObject[column][currentLanguage]}
                            </button>
                          </td>
                        );
                      }
                      return <td>{record[column]}</td>;
                    })}
                  </tr>
                );
              })
            : null}
        </table>
      </div>
      <div>PAGES</div>
    </div>
  );
}
