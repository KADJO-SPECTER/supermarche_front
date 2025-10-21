// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
// import { useAuth } from "../contexts/useAuth";
import {useAuth} from "../contexts/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
