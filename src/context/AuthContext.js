import { createContext, useReducer, useContext } from "react";
import userReducer, { initialState } from "./authReducer";
import { AUTH, LOGOUT } from "./actionTypes";

const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const signup = (user) => {
    dispatch({
      type: AUTH,
      payload: {
        ...user,
        name: "Fake Name",
        id: user.email,
      },
    });
  };

  const login = (user) => {
    dispatch({
      type: AUTH,
      payload: {
        ...user,
        name: "Fake Name",
        id: user.email,
      },
    });
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  const value = {
    user: state,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within AuthContext");
  }
  return context;
};

export default useAuth;
