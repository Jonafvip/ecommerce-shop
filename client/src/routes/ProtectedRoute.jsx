import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();
  if (!user) return <Navigate to="/login" />;
  return children;
};
