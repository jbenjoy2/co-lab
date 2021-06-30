import {
  LOGIN_USER,
  LOGOUT_USER,
  UDPATE_USER,
  UPDATE_USER_PROJECT,
  ADD_USER_PROJECT,
  ADD_USER_COWRITE,
  DELETE_USER_PROJECT
} from "../actions/types";

const INITIAL_STATE = {
  currentUser: {}
};

const rootReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, currentUser: action.user };
    case UDPATE_USER:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          firstName: action.user.firstName,
          lastName: action.user.lastName,
          email: action.user.email
        }
      };
    case ADD_USER_PROJECT: {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          projects: [
            ...state.currentUser.projects,
            {
              ...action.project,
              owner: true
            }
          ]
        }
      };
    }
    case ADD_USER_COWRITE: {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          projects: [
            ...state.currentUser.projects,
            {
              ...action.project,
              owner: false
            }
          ]
        }
      };
    }
    case UPDATE_USER_PROJECT: {
      const otherProjs = state.currentUser.projects.filter(proj => proj.id !== action.project.id);

      const isOwner = state.currentUser.projects.filter(proj => proj.id === action.project.id)[0]
        .owner;

      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          projects: [
            ...otherProjs,
            {
              ...action.project,
              owner: isOwner
            }
          ]
        }
      };
    }
    case DELETE_USER_PROJECT: {
      const otherProjs = state.currentUser.projects.filter(proj => proj.id !== action.projectId);
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          projects: [...otherProjs]
        }
      };
    }

    case LOGOUT_USER:
      return { ...state, currentUser: {} };
    default:
      return state;
  }
};

export default rootReducer;
