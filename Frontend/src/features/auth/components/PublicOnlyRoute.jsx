import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import LoadingScreen from "../../../components/LoadingScreen";

const PublicOnlyRoute = () => {
    const { isAuthenticated, initialized, loading, initializeAuth } = useAuth();

    useEffect(() => {
        if (!initialized) {
            initializeAuth();
        }
    }, [initialized]);

    if (!initialized || loading) {
        return <LoadingScreen label="Checking response..." />;
    }

    if (isAuthenticated) {
        return <Navigate to="/chat" replace />;
    }

    return <Outlet />;
};

export default PublicOnlyRoute;
