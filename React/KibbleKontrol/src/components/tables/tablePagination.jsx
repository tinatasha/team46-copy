import React, { useState } from "react";

const TablePagination = ({ currPage, updateCurrentPage, numPages }) => {
  const outputPageList = () => {
    let arrList = [];

    arrList.push(
      //handle edge case for no content
      <li
        id="basic-datatables_previous"
        className={
          currPage === 1
            ? "paginate_button page-item previous disabled"
            : "paginate_button page-item previous"
        }
      >
        <a
          aria-controls="basic-datatables"
          className="page-link"
          onClick={() => updateCurrentPage(currPage - 1)}
        >
          Previous
        </a>
      </li>
    );
    for (let i = 1; i <= numPages; i++) {
      const LI = (
        <li
          id={i}
          className={
            currPage === i
              ? "paginate_button page-item active "
              : "paginate_button page-item "
          }
        >
          <a
            className="page-link "
            aria-controls="basic-datatables"
            onClick={() => updateCurrentPage(i)}
          >
            {i}
          </a>
        </li>
      );
      arrList.push(LI);
    }

    arrList.push(
      <li
        id="basic-datatables_next"
        className={
          currPage === numPages || currPage + 1 === 1
            ? "paginate_button page-item next disabled"
            : "paginate_button page-item next"
        }
      >
        <a
          aria-controls="basic-datatables"
          className="page-link"
          onClick={() => updateCurrentPage(currPage + 1)}
        >
          Next
        </a>
      </li>
    );

    return arrList;
  };

  return (
    <div className="dataTables_paginate paging_simple_numbers">
      <ul className="pagination">{outputPageList()}</ul>
    </div>
  );
};
export default TablePagination;
