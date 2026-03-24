import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

export const createGuest = async (payload = {}) => {
    const { data } = await api.post("/api/guest/create", payload);
    return data;
};

export const sendGuestMessage = async (payload) => {
    const { data } = await api.post("/api/guest/chat", payload);
    return data;
};

export const getGuestChat = async (chatId) => {
    const { data } = await api.get(`/api/guest/chat/${chatId}`);
    return data;
};

export const clearGuestChat = async (chatId) => {
    const { data } = await api.post("/api/guest/clear", { chatId });
    return data;
};

export const deleteGuestChat = async (chatId) => {
    const { data } = await api.post(`/api/guest/chat/${chatId}/delete`, {
        chatId,
    });
    return data;
};

export const getGuestStatus = async (chatId) => {
    const { data } = await api.get(`/api/guest/status/${chatId}`);
    return data;
};
