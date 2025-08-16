import { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { useDebouncer } from "../custom hooks/useDebouncer";
import AuthContext from "../context/authentication/authContext";
import { Link } from "react-router";
import TablePagination from "../components/tables/tablePagination";
import ShowAlert from "../components/alertModal";
const StaffPage = () => {
  const buttonStyles = {
    register: {
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      "&:hover": {
        backgroundColor: "#3e8e41",
      },
    },
    edit: {
      backgroundColor: "#2196F3",
      color: "white",
      border: "none",
      "&:hover": {
        backgroundColor: "#0b7dda",
      },
    },
    submit: {
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      "&:hover": {
        backgroundColor: "#3e8e41",
      },
    },
    cancel: {
      backgroundColor: "#9E9E9E",
      color: "white",
      border: "none",
      "&:hover": {
        backgroundColor: "#757575",
      },
    },
    deactivate: {
      backgroundColor: "#F44336",
      color: "white",
      border: "none",
      "&:hover": {
        backgroundColor: "#d32f2f",
      },
    },
     assign: {
      backgroundColor: "#9C27B0",
      color: "white",
      border: "none",
      "&:hover": {
        backgroundColor: "#7B1FA2",
      },
    },

    filter: {
      backgroundColor: "#FFC107",
      color: "white",
      border: "none",
      "&:hover": {
        backgroundColor: "#ffab00",
      },
    },
  };

  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({
    User_FullName: "",
    User_Surname: "",
    User_Telephone: "",
  });
  const { user, userRegion } = useContext(AuthContext);
  const [filter, setFilter] = useState("All");
  const [searchParams, setSearchParams] = useState("");
  const debounceSearch = useDebouncer(searchParams, 500);
  const [currPage, setCurrPage] = useState(1);
  const LIMIT = 5;
  const [limitUnderFlow, setLimitUnderFlow] = useState(LIMIT);
  const [pageCount, setPageCount] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);



  const [assigningStoresId, setAssigningStoresId] = useState(null);
  const [allStores, setAllStores] = useState([]);
  const [assignedStores, setAssignedStores] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);



  const fetchUsers = async () => {
    try {
      const params = {
        limit: LIMIT,
        currentPage: currPage,
        role: filter,
        region: userRegion,
      };

      if (debounceSearch) {
        params.searchParams = debounceSearch;
      }

      if (!userRegion) {
        return;
      }
      const res = await api.get(`/users`, { params });

      if (res.data.success) {
        setTotalRecords(res.data.numEmployees);
        setUsers(res.data.users);

        if (res.data.users.length < LIMIT) {
          setLimitUnderFlow(res.data.users.length);
        } else {
          setLimitUnderFlow(LIMIT);
        }
      }
    } catch (err) {
      console.error(err);
      ShowAlert("error", "Could not fetch users", "User Retrieval");
    }
  };



  const fetchAllStores = async () => {
    try {
      const res = await api.get("/store/stores/all");
       if (res.data.success) {
        setAllStores(res.data.stores);
       }
       } catch (err) {
        ShowAlert("error","Could not fetch stores", "Store Retrieval");
       }
  };

  const fetchAssignedStores = async (userId) => {
    try {
      const res = await api.get(`/users/${userId}/stores`);
      if (res.data.success) {
        setAssignedStores(res.data.stores);
        setSelectedStores(res.data.stores.map(store => store.Id));
      }
    } catch (err) {
      ShowAlert("error","Could not fetch assigned stores","Store Retrieval");
    }
  };




  const startStoreAssignment = async (user) => {
    setAssigningStoresId(user.Id);
    await fetchAllStores();
    await fetchAssignedStores(user.Id)
  };

  const handleStoreSelection = (storeId) => {
    setSelectedStores(prev => {
      if (prev.includes(storeId)) {
        return prev.filter(id => id !== storeId);

      } else {
        return [...prev, storeId]
      }
    });
  };


  const submitStoreAssignment = async () => {
    try {
await api.put(`/users/${assigningStoresId}/stores`, {
  stores: selectedStores
});
ShowAlert("success", "Store assignments updated successfully", "Store Assignment");
setAssigningStoresId(null);
fetchUsers();
    } catch(err) {
ShowAlert("error", "Failed to update store assignments", "Store Assignments")
    }
  
  };




  useEffect(() => {
    fetchUsers();
  }, [currPage, filter, debounceSearch, userRegion]);

  const startEdit = (user) => {
    setEditingId(user.Id);
    setEditFields({
      User_FullName: user.User_FullName || "",
      User_Surname: user.User_Surname || "",
      User_Telephone: user.User_Telephone || "",
    });
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/users/${editingId}`, editFields);

      ShowAlert(
        "success",
        "User Updated Succesfully",
        "User Detail Modification"
      );
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      ShowAlert(
        "error",
        "Faiure to Update User Details Try Again Later",
        "User Detail Update Modification"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      ShowAlert(
        "success",
        "User Account Succesfully Deactivated",
        "User Deactivation"
      );
      fetchUsers();
    } catch (err) {
      ShowAlert(
        "error",
        "User Account Succesfully Deactivated",
        "User Deactivation"
      );
    }
  };
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
  useEffect(() => {
    //set the number of entries on the page

    setPageCount(Math.ceil(totalRecords / LIMIT));
  }, [totalRecords]);

  const updateCurrentPage = (pageNumber) => {
    setCurrPage(pageNumber);
  };

  return (
    <>
      <div className="page-category">
        <div className="col-md-12">
          <div
            className="card mb-4"
            style={{ backgroundColor: "#f9f9f9", border: "none" }}
          >
            <div className="card">
              <div
                className="p-4 mb-4 rounded"
                style={{ backgroundColor: "transparent", border: "none" }}
              >
                <div
                  className="card"
                  style={{ backgroundColor: "transparent", border: "none" }}
                >
                  <div className="card-header text-center bg-transparent border-0">
                    <div className="d-flex align-items-center justify-content-center">
                      <h4 className="card-title" style={{ color: "#333333" }}>
                        Staff Management
                      </h4>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row justify-content-center">
                      <div className="col-sm-12 col-md-6">
                        <div className="mb-3">
                          <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0">
                              Search:
                            </span>
                            <input
                              type="search"
                              className="form-control border-start-0"
                              placeholder="Search employees..."
                              style={{ minWidth: "200px " }}
                              onChange={(e) => {
                                setSearchParams(e.target.value);
                              }}
                            />
                          </div>
                        </div>

                        <div className="text-center">
                          <Link
                            to={"/staff/registration"}
                            className="btn"
                            style={{
                              padding: "8px 16px",
                              border: "1px solid #e0e0e0",
                              borderRadius: "4px",
                              height: "38px",
                              minWidth: "200px",
                              display: "inline-block",
                              textDecoration: "none",
                              transition: "all 02s ease",
                              cursor: "pointer",
                              ...buttonStyles.register,
                            }}
                          >
                            <i className="fa fa-user-plus me-2"></i>
                            Register New Staff
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mt-4">
                <div className="card-body">
                  <div className="text-center" mb-3>
                    <h4 className="card-title m-0" style={{ color: "#333333" }}>
                      Staff Members
                    </h4>
                  </div>
                  <div className="table-responsive">
                    <div
                      id="multi-filter-select_wrapper"
                      className="dataTables_wrapper container-fluid dt-bootstrap4"
                    >
                      <div className="row">
                        <div className="col-sm-12 col-md-6">
                          <div
                            className="dataTables_length"
                            id="multi-filter-select_length"
                          >
                            <label>
                              View
                              <select
                                name="multi-filter-select_length"
                                aria-controls="multi-filter-select"
                                className="form-control form-control-sm"
                                onChange={(prev) => {
                                  console.log(prev.target.value);
                                  if (prev.target.value === "All") {
                                    setFilter("All");
                                  } else if (prev.target.value === "Reps") {
                                    setFilter("SRep");
                                  } else if (prev.target.value === "Drivers") {
                                    setFilter("Driver");
                                  }
                                }}
                              >
                                <option value="All">All</option>
                                <option value="Reps">Sales Reps</option>
                                <option value="Drivers">Drivers</option>
                              </select>
                            </label>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-6 d-flex justify-content-end"></div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12">
                          <table
                            id="multi-filter-select"
                            className="display table table-striped table-hover dataTable"
                            role="grid"
                          >
                            <colgroup>
                              <col style={{ width: "100px" }}></col>
                              <col></col>
                              <col></col>
                              <col></col>
                              <col></col>
                              <col></col>
                              <col></col>
                              <col></col>
                                   <col></col>
                            </colgroup>
                            <thead>
                              <tr role="row">
                                <th
                                  className=""
                                  tabIndex="0"
                                  aria-controls="multi-filter-select"
                                  rowSpan="1"
                                  colSpan="1"
                                  style={{ width: "100px" }}
                                >
                                  Full Name
                                </th>
                                <th
                                  tabIndex="0"
                                  aria-controls="multi-filter-select"
                                  rowSpan="2"
                                  colSpan="1"
                                  aria-label="Position: activate to sort column ascending"
                                >
                                  Surname
                                </th>

                                <th
                                  tabIndex="0"
                                  aria-controls="multi-filter-select"
                                  rowSpan="1"
                                  colSpan="1"
                                  aria-label="Office: activate to sort column ascending"
                                >
                                  Phone Number
                                </th>
                                <th
                                  tabIndex="0"
                                  aria-controls="multi-filter-select"
                                  rowSpan="1"
                                  colSpan="1"
                                  aria-label="Start date: activate to sort column ascending"
                                >
                                  Email
                                </th>
                                <th
                                  tabIndex="0"
                                  aria-controls="multi-filter-select"
                                  rowSpan="1"
                                  colSpan="1"
                                  aria-label="Start date: activate to sort column ascending"
                                >
                                  Position
                                </th>
                                <th
                                  tabIndex="0"
                                  aria-controls="multi-filter-select"
                                  rowSpan="1"
                                  colSpan="1"
                                  aria-label="Salary: activate to sort column ascending"
                                >
                                  Start Date
                                </th>
                                <th
                                  tabIndex="0"
                                  aria-controls="multi-filter-select"
                                  rowSpan="1"
                                  colSpan="1"
                                  aria-label="Salary: activate to sort column ascending"
                                >
                                  Edit User
                                </th>
                                 <th
                                  tabIndex="0"
                                  aria-controls="multi-filter-select"
                                  rowspan="1"
                                  colspan="1"
                                  aria-label="Salary: activate to sort column ascending"
                                >
                                  Assign Stores
                                </th>
                                <th
                                  tabIndex="0"
                                  aria-controls="multi-filter-select"
                                  rowSpan="1"
                                  colSpan="1"
                                  aria-label="Salary: activate to sort column ascending"
                                >
                                  Deactivate User
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {users.map((user, index) => (
                                <tr
                                  key={user.Id}
                                  role="row"
                                  className={index % 2 > 0 ? "odd" : "even"}
                                >
                                  <td>
                                    {editingId === user.Id ? (
                                      <input
                                        value={editFields.User_FullName}
                                        className="form-control form-control-sm"
                                        placeholder="New Full Name"
                                        onChange={(e) =>
                                          setEditFields({
                                            ...editFields,
                                            User_FullName: e.target.value,
                                          })
                                        }
                                      ></input>
                                    ) : (
                                      user.User_FullName
                                    )}
                                  </td>
                                  <td>
                                    {editingId === user.Id ? (
                                      <input
                                        value={editFields.User_Surname}
                                        placeholder="New Surname"
                                        className="form-control form-control-sm"
                                        onChange={(e) =>
                                          setEditFields({
                                            ...editFields,
                                            User_Surname: e.target.value,
                                          })
                                        }
                                      ></input>
                                    ) : (
                                      user.User_Surname
                                    )}
                                  </td>
                                  <td>
                                    {editingId === user.Id ? (
                                      <input
                                        value={editFields.User_Telephone}
                                        placeholder="New Telephone"
                                        className="form-control form-control-sm"
                                        onChange={(e) =>
                                          setEditFields({
                                            ...editFields,
                                            User_Telephone: e.target.value,
                                          })
                                        }
                                      ></input>
                                    ) : (
                                      user.User_Telephone
                                    )}
                                  </td>
                                  <td>{user.User_Email}</td>
                                  <td>
                                    {user.User_Type === "SRep"
                                      ? "Sales Rep"
                                      : "Driver"}
                                  </td>
                                  <td>
                                    {formatDateTime(
                                      user.User_CreationTime,
                                      false
                                    )}
                                  </td>
                                  <td>
                                    <button
                                      className="btn"
                                      onClick={() => startEdit(user)}
                                      hidden={
                                        editingId === user.Id ? true : false
                                      }
                                      style={{
                                        padding: "8px 16px",
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "4px",
                                        height: "38px",
                                        minWidth: "200px",
                                        display: "inline-block",
                                        textDecoration: "none",
                                        transition: "all 02s ease",
                                        cursor: "pointer",
                                        ...buttonStyles.edit,
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <div className="d-flex gap-2">
                                      <button
                                        className="btn"
                                        hidden={
                                          editingId === user.Id ? false : true
                                        }
                                        onClick={() => {
                                          setEditingId(null);
                                        }}
                                        style={{
                                          padding: "8px 16px",
                                          border: "1px solid #e0e0e0",
                                          borderRadius: "4px",
                                          height: "38px",
                                          minWidth: "200px",
                                          display: "inline-block",
                                          textDecoration: "none",
                                          transition: "all 02s ease",
                                          cursor: "pointer",
                                          ...buttonStyles.cancel,
                                        }}
                                      >
                                        Cancel
                                      </button>

                                      <button
                                        className="btn"
                                        hidden={
                                          editingId === user.Id ? false : true
                                        }
                                        onClick={() => {
                                          handleUpdate();
                                        }}
                                        style={{
                                          padding: "8px 16px",
                                          border: "1px solid #e0e0e0",
                                          borderRadius: "4px",
                                          height: "38px",
                                          minWidth: "200px",
                                          display: "inline-block",
                                          textDecoration: "none",
                                          transition: "all 02s ease",
                                          cursor: "pointer",
                                          ...buttonStyles.submit,
                                        }}
                                      >
                                        Submit
                                      </button>
                                    </div>
                                  </td>

                                  <td>
                                   {user.User_Type === "SRep" && (

                                    <>
                                    <button
                                    className="btn"
                                    onClick={() => startStoreAssignment(user)}
                                    hidden={assigningStoresId === user.Id}
                                    style={{
                                      padding: "8px 16px",
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "4px",
                                        height: "38px",
                                        minWidth: "200px",
                                        display: "inline-block",
                                        textDecoration: "none",
                                        transition: "all 02s ease",
                                        cursor: "pointer",
                                        ...buttonStyles.assign,
                                    }}
                                    >
                                   Assign Stores
                                    </button>
                                    {assigningStoresId === user.Id && (
                                      <div className="store-assignment-model">
                                        <div className="mb-3">
                                          <h6>Assign Stores</h6>
                                          <div className="store-list" style={{ maxHeight: "200px", overflowY: "auto"}}>
                                            {allStores.map(store => (
                                              <div key={store.Id} className="form-check">
                                                <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id={`store-${store.Id}`}
                                                checked={selectedStores.includes(store.Id)}
                                                onChange={() => handleStoreSelection(store.Id)}
                                                />
                                                <label className="form-check-label" htmlFor={`store-${store.Id}`}>
                                                  {store.Name} ({store.Size})
                                                </label>
                                                </div>
                                            ))}
                                     

                                          </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                          <button
                                    className="btn"
                                    onClick={() => setAssigningStoresId(null)}
              
                                    style={{
                                      padding: "8px 16px",
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "4px",
                                        height: "38px",
                                        minWidth: "200px",
                                        display: "inline-block",
                                        textDecoration: "none",
                                        transition: "all 02s ease",
                                        cursor: "pointer",
                                        ...buttonStyles.cancel,
                                    }}
                                  >

                                    Cancel
                                  </button>

                                  <button
                                    className="btn"
                                    onClick={submitStoreAssignment}
                                    
                                    style={{
                                      padding: "8px 16px",
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "4px",
                                        height: "38px",
                                        minWidth: "200px",
                                        display: "inline-block",
                                        textDecoration: "none",
                                        transition: "all 02s ease",
                                        cursor: "pointer",
                                        ...buttonStyles.submit,
                                    }}
                                    >

                                      Save
                                    </button>
                                        </div>
                                      </div>
                                    )}
                                    </>
                                   )}

                                  </td>
                                  <td>
                                    <button
                                      className="btn"
                                      onClick={() =>
                                        ShowAlert(
                                          "question",
                                          "Are you sure you wish to deactivate this account",
                                          "Deactivation Confirmation",
                                          null,
                                          true,
                                          () => handleDelete(user.Id)
                                        )
                                      }
                                      style={{
                                        padding: "8px 16px",
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "4px",
                                        height: "38px",
                                        minWidth: "200px",
                                        display: "inline-block",
                                        textDecoration: "none",
                                        transition: "all 02s ease",
                                        cursor: "pointer",
                                        ...buttonStyles.deactivate,
                                      }}
                                    >
                                      Deactivate
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className=" row">
                          <div className="col-sm-12 col-md-5">
                            <div className="dataTable_info" aria-live="polite">
                              Showing {(currPage - 1) * LIMIT + 1} to{" "}
                              {limitUnderFlow} of {totalRecords} entries
                            </div>
                          </div>

                          <div className="col-sm-12 col-md-7">
                            <TablePagination
                              currPage={currPage}
                              updateCurrentPage={updateCurrentPage}
                              numPages={pageCount}
                            />
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
      </div>
    </>
  );
};
export default StaffPage;