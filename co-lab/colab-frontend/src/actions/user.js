import {
  ADD_USER_PROJECT,
  LOGIN_USER,
  LOGOUT_USER,
  UDPATE_USER,
  UPDATE_USER_PROJECT,
  DELETE_USER_PROJECT,
  ADD_USER_COWRITE
} from "./types";
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
    return dispatch(updateUser(res));
  };
}

const updateUser = user => {
  return {
    type: UDPATE_USER,
    user
  };
};
export function addUserProjectApi(title, owner) {
  return async function(dispatch) {
    const res = await Api.createNewProject(title, owner);
    return dispatch(addUserProject(res));
  };
}

const addUserProject = project => {
  return {
    type: ADD_USER_PROJECT,
    project
  };
};

export function addUserCowrite(project) {
  return {
    type: ADD_USER_COWRITE,
    project
  };
}
export function updateUserProjectApi(projectId, data) {
  return async function(dispatch) {
    const res = await Api.updatedProject(projectId, data);
    return dispatch(updateUserProject(res.updated));
  };
}

const updateUserProject = project => {
  return {
    type: UPDATE_USER_PROJECT,
    project
  };
};

export function deleteUserProjectApi(projectId) {
  return async function(dispatch) {
    const res = await Api.deleteProject(projectId);
    return dispatch(deleteUserProject(+res.deleted));
  };
}

const deleteUserProject = projectId => {
  return {
    type: DELETE_USER_PROJECT,
    projectId
  };
};
export function leaveProjectApi(projectId, username) {
  projectId = +projectId;
  return async function(dispatch) {
    const res = await Api.leaveProject({ projectId, username });
    return dispatch(deleteUserProject(+res.removed.projectId));
  };
}

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
