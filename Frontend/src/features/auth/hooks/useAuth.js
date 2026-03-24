import { useDispatch, useSelector } from "react-redux";
import {
    forgotPassword as forgotPasswordApi,
    getMe as getMeApi,
    loginUser,
    logoutUser,
    registerUser,
    resetPassword as resetPasswordApi,
    verifyEmail as verifyEmailApi,
} from "../services/auth.api";
import {
    clearAuthError,
    clearAuthSuccessMessage,
    clearAuthUser,
    setAuthError,
    setAuthInitialized,
    setAuthLoading,
    setAuthSuccessMessage,
    setAuthUser,
} from "../store/authSlice";

const getErrorMessage = (error, fallback) =>
    error.response?.data?.message || fallback;

const useAuth = () => {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    const runAsync = async (callback, fallbackMessage) => {
        dispatch(setAuthLoading(true));
        dispatch(setAuthError(null));

        try {
            return await callback();
        } catch (error) {
            dispatch(setAuthError(getErrorMessage(error, fallbackMessage)));
            throw error;
        } finally {
            dispatch(setAuthLoading(false));
        }
    };

    const register = async (payload) =>
        runAsync(async () => {
            const data = await registerUser(payload);
            dispatch(setAuthSuccessMessage(data.message || "Registered successfully"));
            return data;
        }, "Failed to register");

    const login = async (payload) =>
        runAsync(async () => {
            const data = await loginUser(payload);
            dispatch(setAuthUser(data.user || null));
            dispatch(setAuthSuccessMessage(data.message || "Logged in successfully"));
            return data;
        }, "Failed to login");

    const getMe = async () =>
        runAsync(async () => {
            const data = await getMeApi();
            dispatch(setAuthUser(data.user || null));
            return data;
        }, "Failed to fetch user");

    const logout = async () =>
        runAsync(async () => {
            const data = await logoutUser();
            dispatch(clearAuthUser());
            dispatch(setAuthSuccessMessage(data.message || "Logged out successfully"));
            return data;
        }, "Failed to logout");

    const forgotPassword = async (payload) =>
        runAsync(async () => {
            const data = await forgotPasswordApi(payload);
            dispatch(setAuthSuccessMessage(data.message || "Reset email sent"));
            return data;
        }, "Failed to send reset email");

    const resetPassword = async (token, payload) =>
        runAsync(async () => {
            const data = await resetPasswordApi(token, payload);
            dispatch(setAuthSuccessMessage(data.message || "Password reset successfully"));
            return data;
        }, "Failed to reset password");

    const verifyEmail = async (token) =>
        runAsync(async () => {
            return await verifyEmailApi(token);
        }, "Failed to verify email");

    const initializeAuth = async () => {
        dispatch(setAuthLoading(true));

        try {
            const data = await getMeApi();
            dispatch(setAuthUser(data.user || null));
        } catch {
            dispatch(clearAuthUser());
        } finally {
            dispatch(setAuthInitialized(true));
            dispatch(setAuthLoading(false));
        }
    };

    return {
        ...authState,
        initializeAuth,
        register,
        login,
        getMe,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        clearAuthError: () => dispatch(clearAuthError()),
        clearAuthSuccessMessage: () => dispatch(clearAuthSuccessMessage()),
    };
};

export default useAuth;
