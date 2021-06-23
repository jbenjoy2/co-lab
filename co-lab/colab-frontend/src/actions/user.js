import { LOGIN_USER, LOGOUT_USER, UDPATE_USER } from "./types";
import Api from "../api/colabApi";

export function getUserApi(username) {
  return async function(dispatch) {
    const res = await Api.getUser(username);
    return dispatch(setUser(res));
  };
}

const setUser = user => {
  return {
    type: LOGIN_USER,
    user
  };
};

export function updateUserApi(username, data) {
  return async function(dispatch) {
    const res = await Api.updateUser(username, data);
    console.log("response", res);
    return dispatch(updateUser(res));
  };
}

const updateUser = user => {
  return {
    type: UDPATE_USER,
    user
  };
};

export function logoutUser() {
  return function(dispatch) {
    return dispatch(logout());
  };
}

const logout = () => {
  return {
    type: LOGOUT_USER
  };
};
