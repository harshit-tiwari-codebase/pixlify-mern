import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import LoadingScreen from "../features/post/components/common/LoadingScreen";

const ProtectedRoute = () => {
  const { user, checkingAuth } = useAuth();

  if (checkingAuth) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;