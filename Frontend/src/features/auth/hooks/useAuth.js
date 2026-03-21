import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { register, login, getMe, logout } from "../service/auth.api";
import { setError, setUser, setLoading, clearUser } from "../auth.slice";
import { clearChatState } from "../../chat/chat.slice";

export const useAuth = () => {
    const dispatch = useDispatch();

    const handleRegister = useCallback(async ({ name, username, email, password }) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            await register({ name, username, email, password });
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || err?.message || "Registration failed"));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleLogin = useCallback(async ({ identifier, password }) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const { user } = await login({ identifier, password });
            dispatch(setUser(user));
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || err?.message || "Login failed"));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleGetMe = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const { user } = await getMe();
            dispatch(setUser(user));
        } catch {
            // 401 = no session, not an error to display
            dispatch(setUser(null));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleLogout = useCallback(async () => {
        try {
            await logout();
        } finally {
            dispatch(clearUser());
            dispatch(clearChatState());
        }
    }, [dispatch]);

    return { handleRegister, handleLogin, handleGetMe, handleLogout };
};
