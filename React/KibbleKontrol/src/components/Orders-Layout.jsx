import React from "react";
import { Outlet } from "react-router";
import { Link } from "react-router";
const OrderLayout = () => {
  return (
     <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <h4 className="page-title" style={{ color: "#333333"}}>Orders</h4>
              <ul className="breadcrumbs">
                <li className="nav-home">
                  <a href="#">
                    <i className="icon-home" style={{ color: "#333333"}}></i>
                  </a>
                </li>
                <li className="separator">
                  <i className="icon-arrow-right" style={{ color: "#333333"}}></i>
                </li>
                <li className="nav-item">
                  <a href="#" style={{ color: "#333333"}}>Orders</a>
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
export default OrderLayout;
