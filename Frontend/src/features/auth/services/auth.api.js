import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

export const registerUser = async (payload) => {
    const { data } = await api.post("/api/auth/register", payload);
    return data;
};

export const loginUser = async (payload) => {
    const { data } = await api.post("/api/auth/login", payload);
    return data;
};

export const getMe = async () => {
    const { data } = await api.get("/api/auth/get-me");
    return data;
};

export const logoutUser = async () => {
    const { data } = await api.post("/api/auth/logout");
    return data;
};

export const forgotPassword = async (payload) => {
    const { data } = await api.post("/api/auth/forgot-password", payload);
    return data;
};

export const resetPassword = async (token, payload) => {
    const { data } = await api.post(`/api/auth/reset-password?token=${token}`, payload);
    return data;
};

export const verifyEmail = async (token) => {
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/verify-email?token=${token}`,
        {
            credentials: "include",
        },
    );

    return response.text();
};
