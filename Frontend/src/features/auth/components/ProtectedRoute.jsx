import { useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import LoadingScreen from "../../../components/LoadingScreen";

const ProtectedRoute = () => {
    const { isAuthenticated, initialized, initializeAuth } = useAuth();
    const location = useLocation();
    const initCalledRef = useRef(false);

    useEffect(() => {
        if (!initialized && !initCalledRef.current) {
            initCalledRef.current = true;
            initializeAuth();
        }
    }, [initialized]);

    // Only block render until auth check is done — don't use loading state
    if (!initialized) {
        return <LoadingScreen label="Checking session..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
