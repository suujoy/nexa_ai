import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3000/api/chat", withCredentials: true });

export const createChat = async () => {
    const { data } = await api.post("/");
    return data.chat;
};

export const getAllChats = async () => {
    const { data } = await api.get("/");
    return data.chats;
};

export const getSingleChat = async (chatId) => {
    const { data } = await api.get(`/${chatId}`);
    return { chat: data.chat, messages: data.messages };
};

export const updateChatTitle = async (chatId, title) => {
    const { data } = await api.put(`/${chatId}/title`, { title });
    return data.chat;
};

export const deleteChat = async (chatId) => {
    const { data } = await api.delete(`/${chatId}`);
    return data.message;
};
