import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
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

// identifier can be email or username
export const login = async ({ email, password }) => {
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

export const logout = async () => {
    // extend when backend logout route is added
    return true;
};
