import React, { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { useDebouncer } from "../custom hooks/useDebouncer";
import AuthContext from "../context/authentication/authContext";

import DateRangeSelection from "../components/tables/dateRangePicker";
import ShowAlert from "../components/alertModal";
import Table from "../components/analytics/table";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Typography from "@mui/material/Typography";

const OrderPage = () => {
  const LIMIT = 5;

  const { user, userRegion } = useContext(AuthContext);

  //Orders breakdown state table
  const [csvFile, setCsvFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchParam, setSearchParams] = useState("");
  const debounceSearch = useDebouncer(searchParam, 500);
  const [currPage, setcurrPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limitUnderFlow, setLimitUnderFlow] = useState(LIMIT);
  const [dateRange, setDateRange] = useState();

  //Order Updating
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Store Standing Table
  const [storeStand, setStoreStand] = useState([]);
  const [standFilter, setStandFilter] = useState("All");
  const [standSearcParam, setStandSearchParam] = useState("");
  const debounceStandSearch = useDebouncer(standSearcParam, 500);
  const [standCurrPage, setStandCurrPage] = useState(1);
  const [standPageCount, setStandPageCount] = useState(0);
  const [standTotalRecords, setStandTotalRecords] = useState(0);
  const [standLimitUnderFlow, setStandLimitUnderFlow] = useState(LIMIT);

  //Store Standing Table
  const [moddedOrders, setModdedOrders] = useState([]);
  const [modSearcParam, setModOrdParam] = useState("");
  const debounceModSearch = useDebouncer(modSearcParam, 500);
  const [modDateRange, setModDateRange] = useState();
  const [modCurrPage, setModCurrPage] = useState(1);
  const [modPageCount, setModPageCount] = useState(0);
  const [modTotalRecords, setModTotalRecords] = useState(0);
  const [modLimitUnderFlow, setModLimitUnderFlow] = useState(LIMIT);

  //Orders Requiring Manaul Approval

  const modalStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 1000,
      display: showStatusModal ? "block" : "none",
      transition: "all 0.3s ease-out",
      opacity: showStatusModal ? 1 : 0,
    },

    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      backgroundColor: "#fff",
      padding: "20px",
      zIndex: 1001,
      width: "80%",
      maxWidth: "500px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease-out",
      opacity: showStatusModal ? 1 : 0,
      transform: showStatusModal
        ? "translate(-50%, -50%)"
        : "translate(-50%, -60%)",
    },
    button: {
      padding: "8px 16px",
      margin: "0 5px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
    },

    primaryButton: {
      backgroundColor: "#0b7dda",
      color: "white",
    },
    secondaryButton: {
      backgroundColor: "#6c757d",
      color: "white",
    },

    textarea: {
      width: "100%",
      minHeight: "100px",
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #ced4da",
      marginTop: "8px",
    },
    actionButton: {
      padding: "5px 10px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      marginRight: "5px",
    },
    approveButton: {
      backgroundColor: "#28a745",
      color: "white",
    },
    rejectButton: {
      backgroundColor: "#dc3545",
      color: "white",
    },
  };
  const openStatusModal = (order, status) => {
    setSelectedOrder(order);
    setNewStatus(status);
    setReason("");
    setShowStatusModal(true);
  };

  const handleStatusChange = async () => {
    if (!reason) {
      alert(`Please provide a reason for ${newStatus}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.put(`/orders/${selectedOrder.Id}/status`, {
        status: newStatus,
        reason: reason,
        modifiedBy: user.id,
      });

      if (response.data.success) {
        fetchOrders();
        setShowStatusModal(false);
      } else {
        alert(response.data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);

      if (error.response?.status === 401) {
        alert("Session expired - redirecting to login...");
        window.location.href = "/login";
      } else {
        alert(error.response?.data?.error || "Error updating status");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlerFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setCsvFile(null);
      return;
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      ShowAlert("error", "Please select a CSV file", "Inccorect File Type");

      setCsvFile(null);
      return;
    }
    setCsvFile(file);
  };

  const handleUpload = async () => {
    if (!csvFile) {
      ShowAlert("error", "Please upload A valid CSV File", "CSV Processing");
      return;
    }
    const formData = new FormData();
    formData.append("file", csvFile);
    try {
      await api.post("/orders/upload-csv", formData);
      ShowAlert("success", "CSV uploaded successfully!", "CSV Processing");

      setCsvFile(null);
      fetchOrders();
    } catch (error) {
      ShowAlert("error", "Try Again Later", "Upload Failed");

      console.error(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const params = {
        limit: LIMIT,
        currentPage: currPage,
        filter: filter,
        userRegion: userRegion,
      };

      if (debounceSearch) {
        params.searchParam = debounceSearch;
      }

      if (dateRange) {
        const startDate = dateRange.from.toLocaleDateString();
        const endDate = dateRange.to.toLocaleDateString();

        params.startDate = startDate;
        params.endDate = endDate;
      }

      const response = await api.get("/orders", { params });

      if (response.data.success) {
        setTotalRecords(response.data.totalOrders);
        setOrders(response.data.Orders);

        if (response.data.Orders.length < LIMIT) {
          setLimitUnderFlow(response.data.Orders.length * currPage);
        } else {
          const offset = currPage * LIMIT;

          setLimitUnderFlow(offset);
        }
      }
    } catch (err) {
      console.error("Error fetching orders: ", err);
    }
  };

  const fetchStoreStand = async () => {
    if (!user || !userRegion) return;
    const params = {
      limit: LIMIT,
      page: standCurrPage,
      filter: standFilter,
      region: userRegion,
    };

    if (debounceSearch) {
      params.searchPhrase = debounceSearch;
    }

    try {
      const response = await api.get("/store/get_Store_Standings", { params });

      if (response.data.success) {
        setStoreStand([...response.data.standings]);

        if (response.data.standings.length < LIMIT) {
          setLimitUnderFlow(response.data.standings.length * standCurrPage);
        } else {
          const offset = currPage * LIMIT;
          setLimitUnderFlow(offset);
        }
        setStandTotalRecords(response.data.storeStandTotal);
      }
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  const fetchModdedOrders = async () => {
    if (!user || !userRegion) return;

    const params = { region: userRegion, page: modCurrPage, limit: LIMIT };

    if (debounceModSearch) {
      params.searchParam;
    }
    if (modDateRange) {
      const startDate = modDateRange.from.toLocaleDateString();
      const endDate = modDateRange.to.toLocaleDateString();

      params.startDate = startDate;
      params.endDate = endDate;
    }

    try {
      const response = await api.get("/orders/modified_orders", { params });

      if (response.data.success) {
        setModdedOrders([...response.data.orders]);

        setModTotalRecords(response.data.totalOrders);
        if (response.data.orders.length < LIMIT) {
          setModLimitUnderFlow(response.data.orders.length);
        } else {
          const offset = modCurrPage * LIMIT;
          setModLimitUnderFlow(offset);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter, debounceSearch, dateRange, currPage, userRegion]);
  useEffect(() => {
    //set the number of entries on the page
    setPageCount(Math.ceil(totalRecords / LIMIT));
  }, [totalRecords]);

  useEffect(() => {
    fetchStoreStand();
  }, [standFilter, debounceStandSearch, standCurrPage, userRegion]);

  useEffect(() => {
    setStandPageCount(Math.ceil(standTotalRecords / LIMIT));
  }, [standTotalRecords]);

  useEffect(() => {
    fetchModdedOrders();
  }, [debounceModSearch, modDateRange, modCurrPage, userRegion]);

  useEffect(() => {
    setModPageCount(Math.ceil(modTotalRecords / LIMIT));
  }, [modTotalRecords]);

  const formatDateTime = (dateString, includeTime = true) => {
    if (!dateString) {
      return "";
    }
    const date = new Date(dateString);
    if (includeTime) {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const orderTableFilters = () => {
    return (
      <div className="d-flex flex-row  justify-content-between">
        <div className="m-2">
          <div className="dataTables_length">
            <label className="d-flex align-items-center">
              <span className="me-2">Show</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className=" form-control-sm form-control "
                style={{
                  width: "150px",
                  margin: " 0 5px",
                  height: "38px",
                }}
              >
                <option value="All">All</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <span className="me-2">Orders</span>
            </label>
          </div>
        </div>
        <div className="m-2">
          <div className="dataTables_length">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                Search:
              </span>
              <input
                type="search"
                className="form-control text-dark"
                placeholder="Search order#..."
                style={{
                  minWidth: "200px ",
                  backgroundColor: "white",
                }}
                onChange={(e) => {
                  setSearchParams(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="m-2">
          <DateRangeSelection range={dateRange} onRangeChagne={setDateRange} />
        </div>
      </div>
    );
  };

  const renderOrderTableHeadings = () => {
    let arr = [
      "Order #",
      "Store Name",
      "Placement Date",
      "Drop Date",
      "Upload Time",
      "Status",
      "Gross Cost",
      "Actions",
    ];

    return arr;
  };

  const renderOrderTableData = () => {
    return !!orders?.length ? (
      orders.map((order) => (
        <tr key={order.Id}>
          <td>{order.ExternalOrderNo}</td>
          <td>{order.Store_Ordering?.Name || "Unknown"}</td>

          <td>{formatDateTime(order.Placement_Date, false)}</td>
          <td>{formatDateTime(order.Due_Date, false)}</td>
          <td>{formatDateTime(order.Upload_Timestamp, true)}</td>

          <td>{order.Status}</td>
          <td>R {Number(order.GrossCost || 0).toFixed(2)}</td>
          <td>
            {order.Status !== "Approved" && (
              <button
                style={{
                  ...modalStyles.actionButton,
                  ...modalStyles.approveButton,
                  ":hover": {
                    backgroundColor: "#218838",
                  },
                }}
                onClick={() => openStatusModal(order, "Approved")}
                disabled={order.Status === "Approved"}
              >
                Approve
              </button>
            )}
            {order.Status !== "Rejected" && (
              <button
                style={{
                  ...modalStyles.actionButton,
                  ...modalStyles.rejectButton,
                  ":hover": {
                    backgroundColor: "#c82333",
                  },
                }}
                onClick={() => openStatusModal(order, "Rejected")}
                disabled={order.Status === "Rejected"}
              >
                Reject
              </button>
            )}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="8" style={{ textAlign: "center" }}>
          No orders to display
        </td>
      </tr>
    );
  };

  const renderStandTableHeading = () => {
    const arr = [
      "Store Name",
      "Store Standing",
      "# Demerits",
      "Last Demerit Given",
    ];
    return arr;
  };

  const resnderStandingTable = () => {
    return !!storeStand.length ? (
      storeStand.map((stand) => (
        <tr key={stand.storeId}>
          <td>{stand.storeName}</td>
          <td>{stand.storeStanding}</td>
          <td>{stand.storeDemeritsPoints}</td>
          <td>{stand.demeritUpdateDT}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="8" style={{ textAlign: "center" }}>
          No orders to display
        </td>
      </tr>
    );
  };

  const renderModdedHeadings = () => {
    const arr = [
      "Order #",
      "Store Name",
      "Store Size",
      "Placement Date",
      "Drop Date",
      "Modification Time",
      "Modification Reason",
    ];
    return arr;
  };
  const renderModdedEntries = () => {
    return !!storeStand.length ? (
      moddedOrders.map((order) => (
        <tr key={order.id}>
          <td>{order.externalNo}</td>
          <td>{order.storeName}</td>
          <td>{order.storeSize}</td>
          <td>{order.placeDT}</td>
          <td>{order.dueDT}</td>
          <td>{order.modifiedDt}</td>
          <td>{order.reason}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="8" style={{ textAlign: "center" }}>
          No orders to display
        </td>
      </tr>
    );
  };
  return (
    <div className="col-md-12">
      <div className="card p-3">
        {/*-------------------------------------------------------------------------------------------*/}

        <div
          className="p-4 mb-4 rounded"
          style={{
            backgroundColor: "transparent",
            order: "none",
          }}
        >
          <div
            className="card"
            style={{
              backgroundColor: "transparent",
              order: "none",
            }}
          >
            <div className="card-header text-center bg-transparent border-0">
              <div className="d-flex align-items-center justify-content-center">
                <h4 className="card-title" style={{ color: "#333333" }}>
                  Order Uploads
                </h4>
              </div>
            </div>
            <div className="card-body">
              <div className="row justify-content-center">
                <div className="col-sm-12 col-md-4 text-center">
                  {/*------------------------------------------------*/}
                  <div className="mb-3">
                    <label className="form-lable">Choose CSV File</label>
                    <input
                      className="form-control mx-auto"
                      type="file"
                      accept=".csv"
                      onChange={handlerFileChange}
                      style={{
                        padding: "8px",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        backgroundColor: "#f5f5f5",
                        width: "100%",
                        maxWidth: "400px",
                      }}
                    />
                  </div>

                  <button
                    className="btn mx-auto"
                    onClick={handleUpload}
                    disabled={!csvFile}
                    style={{
                      backgroundColor: "#0b7dda",
                      padding: "8px 16px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                      backgroundColor: "#2196F3",
                      color: "white",
                      transition: "all 0.2s ease",
                      cursor: csvFile ? "pointer" : "not-allowed",
                      height: "38px",
                      minWidth: "120px",
                      display: "block",
                    }}
                  >
                    <i className="fa fa-upload me-2"></i>
                    Upload CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*-------------------------------------------------------------------------------------------*/}
        <div className="row">
          <Table
            renderTableEntries={renderOrderTableData}
            tableName={"Orders Breakdown"}
            tableHeadings={renderOrderTableHeadings()}
            filters={orderTableFilters()}
            currentPage={currPage}
            updateCurrentPage={setcurrPage}
            pageCount={pageCount}
            totalRecords={totalRecords}
            limitUnderFlow={limitUnderFlow}
            Limit={LIMIT}
          />
        </div>
        {showStatusModal && (
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1000,
              }}
              onClick={() => setShowStatusModal(false)}
            />
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                backgroundColor: "#fff",
                padding: "20px",
                zIndex: 1001,
                width: "80%",
                maxWidth: "500px",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ marginTop: 0 }}>Change Order Status</h2>
              <div style={{ marginBottom: "20px" }}>
                <p>
                  Changing status to: <strong>{newStatus}</strong>
                </p>
                <div>
                  <label>Reason:</label>
                  <textarea
                    style={{
                      ...modalStyles.textarea,
                      border: !reason
                        ? "1px solid #dc3545"
                        : newStatus === "Approved"
                        ? "1px solid #28a745"
                        : "1px solid #dc3545",
                    }}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <button
                  style={{
                    padding: "8px 16px",
                    margin: "0 5px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "#6c757d",
                    color: "white",
                  }}
                  onClick={() => setShowStatusModal(false)}
                >
                  Cancel
                </button>
                <button
                  style={{
                    padding: "8px 16px",
                    margin: "0 5px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "#0b7dda",
                    color: "white",
                    marginLeft: "10px",
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                  onClick={handleStatusChange}
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(255, 255, 255,0.3)",
                      }}
                    ></span>
                  )}

                  {isSubmitting ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </>
        )}

        {/*------------------------------------Accoridon start-------------------------------------------------------*/}

        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card card-round">
              <div className="card-header">
                <div className="card-head-row card-tools-still-left">
                  <div className="card-title">Additional Tables</div>
                </div>
              </div>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ArrowDownwardIcon />}
                  aria-controls="panel1-content"
                >
                  <Typography variant="h5" component="h1">
                    Store Standings Table
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="col-12 col-sm-12">
                    <Table
                      renderTableEntries={resnderStandingTable}
                      tableName={"Store Standings"}
                      tableHeadings={renderStandTableHeading()}
                      filters={<></>}
                      currentPage={modCurrPage}
                      updateCurrentPage={setModCurrPage}
                      pageCount={modPageCount}
                      totalRecords={modTotalRecords}
                      limitUnderFlow={modLimitUnderFlow}
                      Limit={LIMIT}
                    />
                  </div>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ArrowDownwardIcon />}
                  aria-controls="panel1-content"
                >
                  <Typography variant="h5" component="h1">
                    Modified Orders Table
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="col-12 col-sm-12">
                    <Table
                      renderTableEntries={renderModdedEntries}
                      tableName={"Modified Orders"}
                      tableHeadings={renderModdedHeadings()}
                      filters={<></>}
                      currentPage={standCurrPage}
                      updateCurrentPage={setStandCurrPage}
                      pageCount={modPageCount}
                      totalRecords={modTotalRecords}
                      limitUnderFlow={modLimitUnderFlow}
                      Limit={LIMIT}
                    />
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </div>

        {/*------------------------------------Accoridon end-------------------------   <div className="col-md-6 col-sm-12">
              <Table
                renderTableEntries={resnderStandingTable}
                tableName={"Modified orders "}
                tableHeadings={renderStandTableHeading()}
                filters={<></>}
                currentPage={currPage}
                updateCurrentPage={setcurrPage}
                pageCount={pageCount}
                totalRecords={totalRecords}
                limitUnderFlow={limitUnderFlow}
                Limit={LIMIT}
              />
            </div>------------------------------*/}
      </div>
    </div>
  );
};
export default OrderPage;
