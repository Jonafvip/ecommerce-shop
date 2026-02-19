import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("El AuthContex debe usurse en useContext");
  }
  return context;
};

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authApi = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/v1/auth/getProfile",
          { withCredentials: true }
        );
        setUser(response.data.data);
      } catch (error) {
        console.error(
          "No active session:",
          error.response?.data?.message || error.message
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    authApi();
  }, []);

  const onLogout = async () => {
    setUser(null);
    toast.success("Has cerrado sesión correctamente", {
      position: "top-center",
    });
    try {
      await axios.post("http://127.0.0.1:8000/api/v1/auth/logout", "", {
        withCredentials: true,
      });
    } catch (error) {
      console.error(
        "Error during logout",
        error.response?.data?.message || error.message
      );
    }
  };

  const value = {
    user,
    setUser,
    loading,
    onLogout,
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
