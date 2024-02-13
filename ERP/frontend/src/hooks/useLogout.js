import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const logout = () => {
    //quitar el user de local
    localStorage.removeItem("userAbogado");
    //logout dispatch
    dispatch({ type: "LOGOUT" });
  };

  return { logout };
};
