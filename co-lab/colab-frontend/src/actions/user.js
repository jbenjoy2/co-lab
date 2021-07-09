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

/**
 * return a thunk that retrieves a user with given username from the api and saves that user as current user in redux store
 *
 */

export function getUserApi(username) {
  return async function(dispatch) {
    const res = await Api.getUser(username);
    return dispatch(setUser(res));
  };
}

// action creator to set current user in redux store
const setUser = user => {
  return {
    type: LOGIN_USER,
    user
  };
};

/**
 *
 * returns a thunk that updates a user in the database and then updates the current user in the redux store
 */
export function updateUserApi(username, data) {
  return async function(dispatch) {
    const res = await Api.updateUser(username, data);
    return dispatch(updateUser(res));
  };
}

// action creator to update user in redux store
const updateUser = user => {
  return {
    type: UDPATE_USER,
    user
  };
};

/**
 * returns a thunk that creates a project in the database for the given user and then adds it to the current user's projects array in the database
 *
 */
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

// action creator to add project to user's projects array in redux store with owner set to false

export function addUserCowrite(project) {
  return {
    type: ADD_USER_COWRITE,
    project
  };
}

/**
 * returns thunk that updates project in API and then update the corresponding project in the user's projects array in the redux store
 *
 */
export function updateUserProjectApi(projectId, data) {
  return async function(dispatch) {
    const res = await Api.updatedProject(projectId, data);
    return dispatch(updateUserProject(res.updated));
  };
}

// action creator to update user project in redux store
const updateUserProject = project => {
  return {
    type: UPDATE_USER_PROJECT,
    project
  };
};

/**
 * returns thunk that deletes project from database and then removes it from the user's projects array in the redux store
 *
 */

export function deleteUserProjectApi(projectId) {
  return async function(dispatch) {
    const res = await Api.deleteProject(projectId);
    return dispatch(deleteUserProject(+res.deleted));
  };
}

// action creator to delete project from user's projects array in redux store
const deleteUserProject = projectId => {
  return {
    type: DELETE_USER_PROJECT,
    projectId
  };
};

/**
 * returns thunk that removes user from project in database and then removes the project from the user's projects array in redux store
 *
 */
export function leaveProjectApi(projectId, username) {
  projectId = +projectId;
  return async function(dispatch) {
    const res = await Api.leaveProject({ projectId, username });
    return dispatch(deleteUserProject(+res.removed.projectId));
  };
}

// returns thunk that logs out user in redux store (sets currentUser to default)
export function logoutUser() {
  return function(dispatch) {
    return dispatch(logout());
  };
}

// action creator to reset current user to default in redux store
const logout = () => {
  return {
    type: LOGOUT_USER
  };
};
