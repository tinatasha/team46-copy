import React, { useContext, useState } from "react";
import AuthContext from "../../context/authentication/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  let navigation = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(email, password);
      if (data.success) {
        navigation("/home", { replace: true });
      } else {
        setLoginError(data.error);
      }
    } catch (error) {
      if (error.status === 401) {
        setLoginError(error.error);
      } else {
        setLoginError("Login Failed Try Again Later");
        console.log(error); //for deubbing only remove when submitting
      }
    }
  };

  return (
    <div className="Center-Container">
      <div>
        <div className="page-inner">
          <div>
            <form onSubmit={handleSubmit}>
              <div id="login-form">
                <div className="card login-card">
                  <div className="card-header">
                    <div className="login-form-head-foot card-title text-center">
                      Login
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12 col-lg-12">
                        <div className="form-group">
                          <label htmlFor="email2">Email Address</label>
                          <input
                            id="EmailID"
                            type="email"
                            className="form-control"
                            placeholder="Enter Email"
                            onChange={handleEmailChange}
                            required={true}
                          />
                          <small
                            id="emailHelp2"
                            className="form-text text-muted"
                          >
                            We'll never share your email with anyone else.
                          </small>
                        </div>
                        <div className="form-group">
                          <label htmlFor="password">Password</label>
                          <input
                            id="PassId"
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            onChange={handlePasswordChange}
                            required={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="login-form-head-foot card-action text-center ">
                    <button className="btn btn-success " type="submit">
                      Login
                    </button>
                  </div>
                  <div className="login-form-head-foot  text-center text-danger">
                    <p>{loginError}</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
