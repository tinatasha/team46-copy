import React, { useState } from "react";
import { Outlet } from "react-router";

const MerchandisingLayout = () => {
  const [pageName, setPageName] = useState("");

  return (
    <div className="container">
      <div className="page-inner">
        <div className="page-header">
          <h4 className="page-title">Merchandising</h4>
        </div>

        <div className="page-category">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default MerchandisingLayout;
