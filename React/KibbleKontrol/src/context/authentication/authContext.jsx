import { createContext } from "react";

const AuthContext = createContext({
  user: null,
  isLoggedIn: false,
  userRegion: "",
  setUserRegion: () => {},
  login: async () => {},
  logout: () => {},
});
export default AuthContext;
