import { createContext, useReducer, useContext, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import firebaseApp from "../utils/firebaseConfig";

import userReducer, { initialState } from "./authReducer";
import { AUTH, LOGOUT } from "./actionTypes";

const AuthContext = createContext(initialState);
const auth = getAuth(firebaseApp);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const signup = (newUser) => {
    createUserWithEmailAndPassword(auth, newUser.email, newUser.password).catch(
      (error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      }
    );
  };

  const login = (user) => {
    setPersistence(auth, browserLocalPersistence)
      .then(async () => {
        try {
          await signInWithEmailAndPassword(auth, user.email, user.password);
        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        dispatch({ type: LOGOUT });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch({
          type: AUTH,
          payload: {
            ...currentUser,
          },
        });
      } else {
        dispatch({ type: LOGOUT });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const value = {
    user: state,
    login,
    logout,
    signup,
    auth,
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
