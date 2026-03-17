import { useDispatch } from "react-redux";
import { register, login, getMe } from "../service/auth.api";
import { setError, setLoading, setUser } from "../auth.slice";

export const useAuth = () => {
    const dispatch = useDispatch();

    const handleRegister = async ({ name, username, email, password }) => {
        try {
            dispatch(setLoading(true));
            const { user } = await register({
                name,
                username,
                email,
                password,
            });
        } catch (err) {
            dispatch(setError(err.message || "Registration Failed"));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleLogin = async ({ email, password }) => {
        try {
            dispatch(setLoading(true));
            const { user } = await login(email, password);
            dispatch(setUser(user));
        } catch (err) {
            dispatch(setError(err.message || "Login Failed"));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleGetMe = async () => {
        try {
            const { user } = await getMe();
            dispatch(setUser(user));
        } catch (err) {
            dispatch(setError(err.message || "Login Failed"));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
    };
};
