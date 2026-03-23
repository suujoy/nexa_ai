import { createBrowserRouter } from "react-router";
import VerifyEmail from "../features/auth/pages/VerifyEmail";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <div>Home</div>,
    },
    {
        path: "/verify-email",
        element: <VerifyEmail />,
    },
]);
