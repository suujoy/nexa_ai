import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { register, login, getMe } from "../service/auth.api";
import { setError, setUser, setLoading } from "../auth.slice";

export const useAuth = () => {
    const dispatch = useDispatch();

    const handleRegister = useCallback(async ({ name, username, email, password }) => {
        try {
            dispatch(setLoading(true));
            await register({
                name,
                username,
                email,
                password,
            });
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || err?.message || "Something went wrong"));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleLogin = useCallback(async ({ email, password }) => {
        try {
            dispatch(setLoading(true));
            const { user } = await login({ email, password });
            dispatch(setUser(user));
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || err?.message || "Something went wrong"));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleGetMe = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const { user } = await getMe();
            dispatch(setUser(user));
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || err?.message || "Something went wrong"));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
    };
};
