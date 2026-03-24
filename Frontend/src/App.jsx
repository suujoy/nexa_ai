import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./app/app.route";
import { useSelector } from "react-redux";

const App = () => {
    const { theme } = useSelector((state) => state.theme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    return <RouterProvider router={router} />;
};

export default App;
