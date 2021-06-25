import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import Routes from "./Components/routes/routes";
import Navbar from "./Components/nav/Navbar";
import useLocalStorage from "./hooks/useLocalStorage";
import { useSelector, useDispatch } from "react-redux";
import { getUserApi, logoutUser } from "./actions/user";
import ColabAPI from "./api/colabApi";
import { useHistory } from "react-router";
import LoadingSpinner from "./Components/auth/LoadingSpinner";

function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { projects } = useSelector(st => st.user.currentUser);
  const [token, setToken] = useLocalStorage("colab-token", null);
  const [infoLoaded, setInfoLoaded] = useState(false);
  useEffect(() => {
    console.debug("App useEffect loadUserInfo", "token=", token);
    async function getCurrentUser() {
      if (token) {
        try {
          const { username } = jwt.decode(token);
          ColabAPI.token = token;
          const setCurrUser = getUserApi(username);
          await setCurrUser(dispatch);
        } catch (error) {
          console.error("error error!", error);
        }
      }
      setInfoLoaded(true);
    }
    setInfoLoaded(false);
    getCurrentUser();
  }, [token, dispatch]);

  const login = async data => {
    try {
      const token = await ColabAPI.loginUser(data);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  };
  const register = async data => {
    try {
      const token = await ColabAPI.registerUser(data);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  };

  const logout = () => {
    try {
      dispatch(logoutUser());
      setToken(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar logout={logout} />
      {!infoLoaded && <LoadingSpinner />}
      {infoLoaded && <Routes login={login} register={register} />}
    </>
  );
}

export default App;
