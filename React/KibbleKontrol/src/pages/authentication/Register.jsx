import React, { useContext, useEffect } from "react";
import api from "../../services/api";
import { useState } from "react";
import Select from "react-select";
import ShowAlert from "../../components/alertModal";
import { useNavigate } from "react-router";
import AuthContext from "../../context/authentication/authContext";

const StaffRegistration = () => {
  const { user, userRegion } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    pass: "",
    type: "",
    fullName: "",
    surname: "",
    region: userRegion,
    phoneNo: "",
    stores: [],
  });
  const [availableStores, setAvailableStores] = useState([]);
  const [disallowStoreSelection, setDisAllowStoreSelection] = useState(true);
  const [userTypeChoosen, setUserTypeChoosen] = useState("Driver"); //start out assuming we want to register a driver
  const [selectedStores, setSelectedStores] = useState([]);

  const navigation = useNavigate();

  useEffect(() => {
    setSelectedStores([]);

    if (userTypeChoosen === "Driver") {
      setAvailableStores([]);

      return;
    }

    const getStoreData = async () => {
      try {
        const response = await api.get("store/view_AvailableStores", {
          params: { region: userRegion, managerId: user.id },
        });

        if (response.data.success) {
          const storeOptions = response.data.stores.map((store) => ({
            value: store.Id,
            label: store.Name,
          }));

          console.log(storeOptions);
          setAvailableStores(storeOptions);
        }
      } catch (error) {
        console.log("failed to get stores due to:" + error);
      }
    };
    getStoreData();
  }, [userTypeChoosen]);

  const handleRegister = async () => {
    try {
      if (form.type === "SRep") {
        const response = await api.post(`/users/register_sales_rep`, form);
        ShowAlert("sucess", response.data.message, "Sales Rep Registraion");

        setUserTypeChoosen("Driver"); //Reset back to default since not using a form for submission
        setForm({
          email: "",
          pass: "",
          type: "",
          fullName: "",
          surname: "",
          region: userRegion,
          phoneNo: "",
          stores: [],
        });
        setSelectedStores([]);
      } else if (form.type === "Driver") {
        const response = await api.post("/users/register_driver", form);

        ShowAlert("sucess", response.data.message, "Sales Rep Registraion");
      }
      return;
    } catch (err) {
      ShowAlert(
        "error",
        err.response?.data?.error || "Failed Registration",
        "Registration Failure"
      );
    }
  };

  return (
    <div>
      <div className="center-container">
        <div className="form-container">
          <form
            className="registration-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <h2>Register New Staff Member</h2>
            <p className="form-subtitle">Manager Registration Portal</p>

            <div className="section-title">Staff Member Information</div>

            <div className="form-group">
              <label htmlFor="staff-role">Staff Role</label>
              <select
                id="staff-role"
                className="form-control"
                required
                onChange={(prev) => {
                  if (prev.target.value === "SRep") {
                    setUserTypeChoosen("SRep");
                    setDisAllowStoreSelection(false);
                  } else if (prev.target.value === "Driver") {
                    setUserTypeChoosen("Driver");
                    setDisAllowStoreSelection(true);
                  }
                  setForm({ ...form, type: prev.target.value });
                }}
                value={form.type}
              >
                <option value="" disabled>
                  Select staff role
                </option>
                <option value="SRep">Sales Representative</option>
                <option value="Driver">Driver</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rep-name">First Name</label>
              <input
                type="text"
                id="rep-name"
                placeholder="Enter staff member's first name"
                required
                onChange={(val) =>
                  setForm({ ...form, fullName: val.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="rep-surname">Last Name</label>
              <input
                type="text"
                id="rep-surname"
                placeholder="Enter staff member's last name"
                required
                onChange={(val) =>
                  setForm({ ...form, surname: val.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="rep-surname">Phone Number</label>
              <input
                type="text"
                id="rep-surname"
                placeholder="Enter staff member's Phone Number"
                required
                maxLength="10"
                onChange={(val) =>
                  setForm({ ...form, phoneNo: val.target.value.length })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="rep-region">Region</label>
              <input
                type="text"
                id="rep-surname"
                placeholder="Staff Region"
                value={userRegion}
                disabled={true}
              />
            </div>

            <div className="form-group">
              <label htmlFor="rep-email">Email</label>
              <input
                type="email"
                id="rep-email"
                placeholder="Enter staff member's email"
                required
                onChange={(val) =>
                  setForm({ ...form, email: val.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="rep-password">Password</label>
              <input
                type="password"
                id="rep-email"
                placeholder="Enter staff member's default password"
                required
                onChange={(val) => setForm({ ...form, pass: val.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="re-stores">Assigned Store</label>
              <Select
                isMulti={true}
                value={selectedStores}
                options={availableStores}
                onChange={(stores) => {
                  setSelectedStores(stores);

                  setForm({ ...form, stores: stores.map((id) => id.value) });
                }}
                disabled={disallowStoreSelection}
                placeholder="Select Stores"
              />
            </div>

            <button type="submit" className="submit-btn">
              Register Staff Member
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default StaffRegistration;
