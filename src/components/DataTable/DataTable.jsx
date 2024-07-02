import { useContext, useState } from "react";
import classes from "./DataTable.module.css";
import { useEffect } from "react";
import { LanguageContext } from "../../App";
import { useNavigate } from "react-router-dom";

export default function DataTable({
  fetchFunction,
  columnsObject,
  skipColumns,
  editUrl,
  deleteUrl,
}) {
  const navigate = useNavigate();
  const currentLanguage = useContext(LanguageContext);

  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const retriveData = async () => {
    const res = await fetchFunction(pageNumber, pageSize);
    console.log(res.data.data);
    setData(res.data.data);
    console.log(data);
  };

  useEffect(() => {
    retriveData();
  }, [currentLanguage]);
  return (
    <div className={`${classes.gridContainer}`}>
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
                            <button>
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

        {/* <ul className={`${classes.ul}`}>
        {data &&
        data.map((record, index) => {
            return <li key={record.id ? record.id : index + 1}></li>;
            })}
            </ul> */}
      </div>
      <div>PAGES</div>
    </div>
  );
}
