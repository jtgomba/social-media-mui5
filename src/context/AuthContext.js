import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  updateProfile,
} from "firebase/auth";
import firebaseApp from "../utils/firebaseConfig";

import userReducer, { initialState } from "./authReducer";
import { AUTH, LOGOUT } from "./actionTypes";

const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [authLoading, setAuthLoading] = useState();
  const auth = getAuth(firebaseApp);

  const signup = async (newUser) => {
    await createUserWithEmailAndPassword(
      auth,
      newUser.email,
      newUser.password
    ).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
    await updateProfile(auth.currentUser, {
      displayName: newUser.displayName,
    });
    dispatch({ type: AUTH, payload: { ...auth.currentUser } });
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
        console.log("this shoulnd not work");
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
