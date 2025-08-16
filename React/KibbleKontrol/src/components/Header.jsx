import { useContext } from "react";
import AuthContext from "../context/authentication/authContext";
import { Link } from "react-router";
import logo from "../assets/img/kaiadmin/logo_light.svg";
const Header = ({ handleBtnOpenClick, handleBtnCloseClick, isOpen }) => {
  const { user, userRegion, setUserRegion } = useContext(AuthContext);
  return (
    <div className="main-header">
      <div className="main-header-logo">
        <div className="logo-header" data-background-color="dark">
          <Link to="/home" className="logo">
            <img
              src={logo}
              alt="navbar brand"
              className="navbar-brand"
              height="20"
            />
          </Link>
          <div className="nav-toggle">
            <button className="btn btn-toggle toggle-sidebar">
              <i className="gg-menu-right"></i>
            </button>
            <button className="btn btn-toggle sidenav-toggler">
              <i className="gg-menu-left"></i>
            </button>
          </div>
          <button className="topbar-toggler more">
            <i className="gg-more-vertical-alt"></i>
          </button>
        </div>
      </div>

      <div class="container-fluid">
        <div className="d-flex justify-content-end">
          <div className="mt-5" style={{ maxWidth: "200px" }}>
            <label className="d-flex align-items-center">
              Select a region
              <select
                className="form-control form-control-sm"
                value={userRegion}
                onChange={(e) => setUserRegion(e.target.value)}
              >
                <option value="Gauteng">Gauteng</option>
                <option value="Limpopo">Limpopo</option>
                <option value="Western Cape">Western Cape</option>
                <option value="Northern Cape">Nothern Cape</option>
                <option value="Eastern Cape">Eastern Cape</option>
                <option value="KZN">KwaZulu-Natal</option>
                <option value="North West">Nothern West</option>
                <option value="Mpumalanga">Mpumalanga</option>
                <option value="Free Sate">Free State</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
