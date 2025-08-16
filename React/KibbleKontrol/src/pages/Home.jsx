import React, { useEffect } from "react";
import { useState, useContext } from "react";
import AuthContext from "../context/authentication/authContext";
import ImageFocusModal from "../components/Merchandise/imageFocusModal";
import axios from "axios";
const HomePage = () => {
  const { user, userRegion } = useContext(AuthContext);

  //pass through as a prop to the modal to have it be displayed when necessary
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [stats, setStats] = useState({
    pendingMerch: 0,
    pendingOrders: 0,
    rejectedOrders: 0,
    overdueOrders: 0,
  });

  useEffect(() => {
    fetchDeliveries();
    fetchStats();
  }, [statusFilter, userRegion]);

  const fetchDeliveries = async () => {
    setLoading(true);

    try {
      const region = userRegion;
      const response = await axios.get(
        statusFilter === "All"
          ? "https://team46-api-copy-production.up.railway.app/deliveries"
          : `https://team46-api-copy-production.up.railway.app/deliveries/by-status-region?status=${statusFilter}&region=${region}`
      );

      const filteredDeliveries =
        statusFilter === "All"
          ? (response.data.deliveries || response.data || []).filter(
              (delivery) => delivery.Order?.Store_Ordering?.Region === region
            )
          : response.data.deliveries || response.data || [];

      setDeliveries(filteredDeliveries);
    } catch (error) {
      console.error("Error fetching deliveries", error);
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "https://team46-api-copy-production.up.railway.app/deliveries/stats"
      );
      setStats(
        response.data.stats ||
          response.data || {
            pendingMerch: 0,
            pendingOrders: 0,
            rejectedOrders: 0,
            overdueOrders: 0,
          }
      );
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        pendingMerch: 0,
        pendingOrders: 0,
        rejectedOrders: 0,
        overdueOrders: 0,
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const statusBadge = (status) => {
    const statusClasses = {
      Pending: "badge-warning",
      "In Transit": "badge-info",
      Delivered: "badge-success",
      Overdue: "badge-danger",
    };

    return (
      <span className={`badge ${statusClasses[status] || "badge-secondary"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="container">
      <div className="page-inner">
        <div className="page-header">
          <h4 className="page-title" style={{ color: "#333333" }}>
            Home
          </h4>
          <ul className="breadcrumbs">
            <li className="nav-home">
              <a href="#">
                <i className="icon-home" style={{ color: "#333333" }}></i>
              </a>
            </li>
            <li className="separator">
              <i className="icon-arrow-right" style={{ color: "#333333" }}></i>
            </li>
            <li className="nav-item">
              <a href="#" style={{ color: "#333333" }}>
                Home
              </a>
            </li>
          </ul>
        </div>

        <div className="page-category">
          <div className="container">
            <div className="page-inner">
              <div className="page-header"></div>

              <div className="row row-card-no-pd">
                <div className="col-sm-6 col-md-3">
                  <div className="card card-stats card-round">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-5">
                          <div className="icon-big text-center">
                            <i className="icon-basket-loaded text-warning"></i>
                          </div>
                        </div>
                        <div className="col-7 col-stats">
                          <div className="numbers">
                            <p className="card-category">Pending Merchandise</p>
                            <h4 className="card-title">{stats.pendingMerch}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 col-md-3">
                  <div className="card card-stats card-round">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-5">
                          <div className="icon-big text-center">
                            <i className="icon-clock text-danger"></i>
                          </div>
                        </div>
                        <div className="col-7 col-stats">
                          <div className="numbers">
                            <p className="card-category">Pending Orders</p>
                            <h4 className="card-title">
                              {stats.pendingOrders}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className="card card-stats card-round">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-5">
                          <div className="icon-big text-center">
                            <i className="icon-close text-success"></i>
                          </div>
                        </div>
                        <div className="col-7 col-stats">
                          <div className="numbers">
                            <p className="card-category">Rejected Orders</p>
                            <h4 className="card-title">
                              {stats.rejectedOrders}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 col-md-3">
                  <div className="card card-stats card-round">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-5">
                          <div className="icon-big text-center">
                            <i className="icon-hourglass text-primary"></i>
                          </div>
                        </div>
                        <div className="col-7 col-stats">
                          <div className="numbers">
                            <p className="card-category">Overdue Orders</p>
                            <h4 className="card-title">
                              {stats.overdueOrders}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <div className="d-flex align-items-center">
                        <h4
                          className="card-title"
                          style={{
                            textAlign: "center",
                            width: "100%",
                            color: "#333333",
                            marginRight: "-70px",
                          }}
                        >
                          Deliveries
                        </h4>
                        <div className="ml-auto">
                          <select
                            className="form-control form-control-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ width: "150px" }}
                          >
                            <option value="Overdue">Overdue</option>
                            <option value="Pending">Pending</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                            <option value="All">All</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table
                          id="add-row"
                          className="display table table-striped table-hover"
                        >
                          <thead>
                            <tr>
                              <th>Order Number</th>
                              <th>Store</th>
                              <th>Region</th>
                              <th>Status</th>
                              <th>Driver</th>
                              <th>Placed On</th>
                              <th>Due Date</th>
                              <th>Delivered On</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr>
                                <td colSpan="8" className="text-center">
                                  <div
                                    className="spinner-border text-primary"
                                    role="status"
                                  >
                                    <span className="sr-only">Loading..</span>
                                  </div>
                                </td>
                              </tr>
                            ) : deliveries.length > 0 ? (
                              deliveries.map((delivery) => (
                                <tr key={delivery.Id}>
                                  <td>
                                    {delivery.Order?.ExternalOrderNo || "N/A"}
                                  </td>
                                  <td>
                                    {delivery.Order?.Store_Ordering?.Name ||
                                      "N/A"}
                                  </td>
                                  <td>
                                    {delivery.Order?.Store_Ordering?.Region ||
                                      "N/A"}
                                  </td>
                                  <td>{statusBadge(delivery.Status)}</td>
                                  <td>
                                    {delivery.Driver?.User_FullName ||
                                      "Unassigned"}
                                  </td>
                                  <td>
                                    {formatDate(delivery.Order?.Placement_Date)}
                                  </td>
                                  <td>
                                    {formatDate(delivery.Order?.Due_Date)}
                                  </td>
                                  <td>
                                    {formatDate(delivery.Order?.DeliveredDate)}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8" className="text-center">
                                  No deliveries found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
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

export default HomePage;
