import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

export const createChat = async (payload = {}) => {
    const { data } = await api.post("/api/chats/create", payload);
    return data;
};

export const getChats = async () => {
    const { data } = await api.get("/api/chats/get");
    return data;
};

export const getChatDetail = async (chatId) => {
    const { data } = await api.get(`/api/chats/detail/${chatId}`);
    return data;
};

export const updateChatTitle = async (chatId, payload) => {
    const { data } = await api.patch(`/api/chats/title/${chatId}`, payload);
    return data;
};

export const updateChatPin = async (chatId, payload) => {
    const { data } = await api.patch(`/api/chats/pin/${chatId}`, payload);
    return data;
};

export const updateChatArchive = async (chatId, payload) => {
    const { data } = await api.patch(`/api/chats/archive/${chatId}`, payload);
    return data;
};

export const getPinnedChats = async () => {
    const { data } = await api.get("/api/chats/pinned");
    return data;
};

export const getArchivedChats = async () => {
    const { data } = await api.get("/api/chats/archived");
    return data;
};

export const changeChatAiModel = async (chatId, payload) => {
    const { data } = await api.patch(`/api/chats/model/${chatId}`, payload);
    return data;
};

export const deleteChatById = async (chatId) => {
    const { data } = await api.delete(`/api/chats/delete/${chatId}`);
    return data;
};
