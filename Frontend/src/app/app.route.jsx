import { createBrowserRouter } from "react-router";
import VerifyEmail from "../features/auth/pages/VerifyEmail";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import PublicOnlyRoute from "../features/auth/components/PublicOnlyRoute";
import AiModelListPage from "../features/aiModel/pages/AiModelListPage";
import CreateAiModelPage from "../features/aiModel/pages/CreateAiModelPage";
import DeleteAiModelPage from "../features/aiModel/pages/DeleteAiModelPage";
import ChatHomePage from "../features/chat/pages/ChatHomePage";
import ChatDetailPage from "../features/chat/pages/ChatDetailPage";
import GuestChatPage from "../features/guest/pages/GuestChatPage";

export const router = createBrowserRouter([
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <ChatHomePage />,
            },
            {
                path: "/ai-models",
                element: <AiModelListPage />,
            },
            {
                path: "/ai-models/create",
                element: <CreateAiModelPage />,
            },
            {
                path: "/ai-models/delete/:modelId",
                element: <DeleteAiModelPage />,
            },
            {
                path: "/chat",
                element: <ChatHomePage />,
            },
            {
                path: "/chat/:chatId",
                element: <ChatDetailPage />,
            },
        ],
    },
    {
        path: "/guest",
        element: <GuestChatPage />,
    },
    {
        path: "/verify-email",
        element: <VerifyEmail />,
    },
    {
        element: <PublicOnlyRoute />,
        children: [
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/forgot-password",
                element: <ForgotPasswordPage />,
            },
            {
                path: "/reset-password",
                element: <ResetPasswordPage />,
            },
        ],
    },
]);
