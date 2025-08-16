import React, { Children, useEffect } from "react";
import { useState, useContext } from "react";
import AuthContext from "./authContext";
import axios from "axios";
import api from "../../services/api";
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRegion, setUserRegion] = useState("");
  //when this mounts check if their is a user in local storage if their is get details from there rather than
  //calling api again
  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("User"));

    if (userInfo) {
      console.log("i running");
      setUser(userInfo);
      setIsLoggedIn(true);
      setUserRegion(userInfo.region);
    }
    setIsLoading(false); //set page to no longer loading for checks to run on user in session storage without overwrites
  }, []);

  const login = async (email, pass) => {
    try {
      const userDetails = {
        email: email,
        password: pass,
      };

      const response = await api.post("users/login", userDetails);
      const data = response.data;

      if (data.success) {
        sessionStorage.setItem("User", JSON.stringify(data.user));

        setUser(response.data.user);

        console.log("response", response.data);
        setUserRegion(response.data.user.region);
        setIsLoggedIn(true);
      }
      return data;
    } catch (error) {
      if (!!error.response.data) {
        return error.response.data;
      } else {
        throw error;
      }
    }
  };
  const logout = () => {
    sessionStorage.removeItem("User");
    setUser(null);
    setIsLoggedIn(false);
    setUserRegion("");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        login,
        logout,
        userRegion,
        setUserRegion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
