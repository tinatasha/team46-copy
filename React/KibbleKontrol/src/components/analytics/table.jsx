import React from "react";
import TablePagination from "../tables/tablePagination";

const Table = ({
  renderTableEntries,
  tableName,
  tableHeadings,
  filters,
  currentPage,
  updateCurrentPage,
  pageCount,
  totalRecords,
  limitUnderFlow,
  Limit,
}) => {
  return (
    <div className="row justify-content-center">
      <div className="col-12">
        <div className="card card-round" style={{ margin: "0 auto" }}>
          <div className="card-header">
            <div className="card-head-row card-tools-still-right">
              <div
                className="card-title"
                style={{
                  textAlign: "center",
                  width: "100%",
                  color: "#333333",
                }}
              >
                {tableName}
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                <div className="table-responsive">{filters}</div>
                <div className="row">
                  <div className="col-sm-12">
                    <table
                      className="display table table-border table-hover dataTable"
                      role="grid"
                    >
                      <colgroup>
                        {tableHeadings?.map((heading, index) => (
                          <col key={index} style={{ maxWidth: "150px" }} />
                        ))}
                      </colgroup>
                      <thead>
                        <tr>
                          {tableHeadings?.map((heading, index) => (
                            <th
                              key={index}
                              className=""
                              tabIndex="0"
                              rowspan="1"
                              colspan="1"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>{renderTableEntries()}</tbody>
                    </table>
                  </div>
                </div>
                <div className=" row">
                  <div className="col-sm-12 col-md-5">
                    <div className="dataTable_info" aria-live="polite">
                      Showing {(currentPage - 1) * Limit + 1} to{" "}
                      {limitUnderFlow} of {totalRecords} entries
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-7">
                    <TablePagination
                      currPage={currentPage}
                      updateCurrentPage={updateCurrentPage}
                      numPages={pageCount}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Table;
