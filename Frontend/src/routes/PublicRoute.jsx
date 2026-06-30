import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import LoadingScreen from "../features/post/components/common/LoadingScreen";

const PublicRoute = () => {
  const { user, checkingAuth } = useAuth();

  // Wait until the initial authentication check is complete
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white">
        <LoadingScreen/>
      </div>
    );
  }

  // If user is already logged in, redirect to feed
  if (user) {
    return <Navigate to="/feed" replace />;
  }

  // Otherwise show Login/Register
  return <Outlet />;
};

export default PublicRoute;