import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export const register = async ({ name, username, email, password }) => {
    const { data } = await api.post("/api/auth/register", {
        name,
        username,
        email,
        password,
    });
    return data;
};

export const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", {
        email,
        password,
    });
    return data;
};

export const getMe = async () => {
    const { data } = await api.get("/api/auth/get-me");
    return data;
};
