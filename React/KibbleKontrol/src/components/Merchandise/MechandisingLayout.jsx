import React, { useState } from "react";
import { Outlet } from "react-router";

const MerchandisingLayout = () => {
  const [pageName, setPageName] = useState("");

  return (
    <div className="container">
      <div className="page-inner">
        <div className="page-header">
          <h4 className="page-title">Merchandising</h4>
          <ul className="breadcrumbs">
            <li className="nav-home">
              <a href="#">
                <i className="icon-home"></i>
              </a>
            </li>
            <li className="separator">
              <i className="icon-arrow-right"></i>
            </li>
            <li className="nav-item">
              <a href="merchandising.html">Merchandising</a>
            </li>
          </ul>
        </div>

        <div className="page-category">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default MerchandisingLayout;
