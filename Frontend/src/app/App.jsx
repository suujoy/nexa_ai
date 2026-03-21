import { RouterProvider } from "react-router";
import router from "./app.routes";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const App = () => {
    const { handleGetMe } = useAuth();
    const darkMode = useSelector((state) => state.theme.darkMode);

    useEffect(() => {
        handleGetMe();
    }, [handleGetMe]);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        document.documentElement.setAttribute(
            "data-theme",
            darkMode ? "dark" : "light",
        );
        window.localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    return <RouterProvider router={router} />;
};

export default App;
