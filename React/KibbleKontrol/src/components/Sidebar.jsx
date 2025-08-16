import React, { useContext, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import logo from "../assets/img/kaiadmin/logo_light.svg";
import AuthContext from "../context/authentication/authContext";
const Sidebar = ({
  handleOn,
  handleOff,
  handleBtnOpenClick,
  handleBtnCloseClick,
  isOpen,
}) => {
  const { logout } = useContext(AuthContext);
  return (
    <div
      onMouseEnter={handleOn}
      onMouseLeave={handleOff}
      className="sidebar sidebar-style-2"
      style={{
        backgroundColor: "#121212",
        color: "#e0e0e0",
      }}
    >
      <div className="sidebar-logo">
        <div
          className="logo-header"
          style={{
            backgroundColor: "#121212",
            borderBottom: "1px solid #2a2a2a",
          }}
        >
          <Link to="/home" className="logo">
            <img
              src={logo}
              alt="navbar brand"
              className="navbar-brand"
              height="20"
            />
          </Link>
          <div className="nav-toggle">
            <button
              className={
                isOpen
                  ? "btn btn-toggle toggle-sidebar"
                  : "btn btn-toggle toggle-sidebar "
              }
              onClick={isOpen ? handleBtnCloseClick : handleBtnOpenClick}
              style={{
                backgroundColor: "#2a2a2a",
                color: "#e0e0e0",
              }}
            >
              <i
                className={isOpen ? "gg-menu-right" : "gg-more-vertical-alt"}
              ></i>
            </button>
          </div>
        </div>
      </div>
      <div
        className="sidebar-wrapper scrollbar scrollbar-inner"
        style={{ backgroundColor: "#121212" }}
      >
        <div className="sidebar-content ">
          <ul className="nav nav-secondary">
            <li className="nav-item">
              <NavLink
                to={"home"}
                style={({ isActive }) => ({
                  color: isActive ? "#ffffff" : "#e0e0e0",
                  backgroundColor: isActive ? "2a2a2a" : "transparent",
                })}
              >
                <i className="fas fa-home"></i>
                <p>Home</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to={"orders"}
                style={({ isActive }) => ({
                  color: isActive ? "#ffffff" : "#e0e0e0",
                  backgroundColor: isActive ? "2a2a2a" : "transparent",
                })}
              >
                <i className="fas fa-shopping-cart"></i>
                <p>Orders</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to={"merchandise"}
                style={({ isActive }) => ({
                  color: isActive ? "#ffffff" : "#e0e0e0",
                  backgroundColor: isActive ? "2a2a2a" : "transparent",
                })}
              >
                <i className="fas fa-store"></i>
                <p>Merchandising</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/staff"
                style={({ isActive }) => ({
                  color: isActive ? "#ffffff" : "#e0e0e0",
                  backgroundColor: isActive ? "2a2a2a" : "transparent",
                })}
              >
                <i className="fas fa-users"></i>
                <p>Staff</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/leaderboard"
                style={({ isActive }) => ({
                  color: isActive ? "#ffffff" : "#e0e0e0",
                  backgroundColor: isActive ? "2a2a2a" : "transparent",
                })}
              >
                <i className="fas fa-trophy"></i>
                <p>Leaderboard</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/analytics"
                style={({ isActive }) => ({
                  color: isActive ? "#ffffff" : "#e0e0e0",
                  backgroundColor: isActive ? "2a2a2a" : "transparent",
                })}
              >
                <i className="fas fa-chart-line"></i>
                <p>Analytics</p>
              </NavLink>
            </li>
          </ul>

          <ul className="nav nav-secondary">
            <li className="nav-item ">
              <NavLink
                to="auth/login"
                style={{ color: "#e0e0e0" }}
                onClick={logout}
              >
                <i className="fas  fa-plane-departure"></i>
                <p>Logout</p>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
