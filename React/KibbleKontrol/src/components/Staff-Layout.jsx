import React from "react";
import { Outlet, Link } from "react-router-dom";

import { useLocation } from "react-router-dom";

const StaffLayout = () => {
  const location = useLocation();

  //this way i can nest registration in th app.jsx but not apply the layout styling
  if (location.pathname.endsWith("/registration")) {
    return <Outlet />;
  }
  return (
    <div className="container">
              <div className="page-inner">
                <div className="page-header">
                  <h4 className="page-title" style={{ color: '#333333'}}>Staff Management</h4>
                  <ul className="breadcrumbs">
                    <li className="nav-home">
                      <a href="#">
                        <i className="icon-home" style={{ color: '#333333'}}></i>
                      </a>
                    </li>
                    <li className="separator">
                      <i className="icon-arrow-right" style={{ color: '#333333'}}></i>
                    </li>
                    <li className="nav-item">
                      <a href="#" style={{ color: '#333333'}}>Staff Management</a>
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
export default StaffLayout;
