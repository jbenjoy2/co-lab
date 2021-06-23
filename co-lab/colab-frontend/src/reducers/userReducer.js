import { LOGIN_USER, LOGOUT_USER, GET_CURRENT_USER, UDPATE_USER } from "../actions/types";

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
    case LOGOUT_USER:
      return { ...state, currentUser: {} };
    default:
      return state;
  }
};

export default rootReducer;
