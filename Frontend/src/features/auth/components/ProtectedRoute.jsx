import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import LoadingScreen from "../../../components/LoadingScreen";

const ProtectedRoute = () => {
    const { isAuthenticated, initialized, loading, initializeAuth } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!initialized) {
            initializeAuth();
        }
    }, [initialized]);

    if (!initialized || loading) {
        return <LoadingScreen label="Checking response..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
