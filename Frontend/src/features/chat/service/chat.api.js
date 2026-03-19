import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

export const sendMessage = async ({ message, chatId }) => {
    const { data } = await api.post("/api/chats/message", { message, chatId });
    return data;
};

export const getChats = async () => {
    const { data } = await api.get("/api/chats");
    return data;
};

export const getMessages = async (chatId) => {
    const { data } = await api.get(`/api/chats/${chatId}/messages`);
    return data;
};

export const deleteChat = async (chatId) => {
    const { data } = await api.delete(`/api/chats/delete/${chatId}`);
    return data;
};
