import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";
import AuthContext from "../context/authentication/authContext";
const PageLayout = () => {
  //Code for handling hovering over the sidebar
  const [hovering, setHovering] = useState(false);
  const [openBarClick, setOpenBarClick] = useState(false);
  const { isLoggedIn, isLoading } = useContext(AuthContext); //loading status updated in the authentication provider on reload
  let navigation = useNavigate();

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      navigation("auth/login", { replace: true });
    }
  }, [isLoggedIn, isLoading]);

  const handleHoverOn = () => {
    setHovering(true);
  };
  const handleHoverOFF = () => {
    setHovering(false);
  };

  const handleOpenClick = () => {
    setOpenBarClick(true);
  };

  const handleCloseClick = () => {
    setOpenBarClick(false);
  };

  const setBarStatus = () => {
    if (openBarClick) {
      return "wrapper sidebar_minimize_hover";
    }
    if (hovering) {
      return "wrapper sidebar_minimize sidebar_minimize_hover";
    } else {
      return "wrapper sidebar_minimize";
    }
  };
  return (
    <div className={setBarStatus()}>
      <Sidebar
        handleOn={handleHoverOn}
        handleOff={handleHoverOFF}
        handleBtnOpenClick={handleOpenClick}
        handleBtnCloseClick={handleCloseClick}
        isOpen={openBarClick}
      />
      <div className="main-panel">
        <Header
          handleBtnOpenClick={handleOpenClick}
          handleBtnCloseClick={handleCloseClick}
          isOpen={openBarClick}
        />

        <Outlet />
      </div>
    </div>
  );
};
export default PageLayout;
