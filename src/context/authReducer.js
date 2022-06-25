import { AUTH, LOGOUT } from "./actionTypes";

export const initialState = {
  name: null,
  id: null,
  email: null,
  password: null,
};

const authReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case AUTH:
      return { ...payload };
    case LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
};

export default authReducer;
