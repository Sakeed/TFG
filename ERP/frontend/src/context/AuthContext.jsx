import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { userAbogado: action.payload };
    case "LOGOUT":
      return { userAbogado: null };
    default:
      return state;
  }
};

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    userAbogado: null,
  });
  useEffect(() => {
    const userAbogado = JSON.parse(localStorage.getItem("userAbogado"));
    if (userAbogado) {
      dispatch({ type: "LOGIN", payload: userAbogado });
    }
  }, []);
  console.log("AuthContext state: ", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
