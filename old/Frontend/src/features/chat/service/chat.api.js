// api/axios.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/chat",
    withCredentials: true,
});

// Create Chat
export const createChat = async () => {
    const { data } = await api.post("/");
    return data.chat; // direct chat object
};

// Get All Chats (sidebar)
export const getAllChats = async () => {
    const { data } = await api.get("/");
    return data.chats; // array
};

// Get Single Chat + Messages
export const getSingleChat = async (chatId) => {
    const { data } = await api.get(`/${chatId}`);
    return {
        chat: data.chat,
        messages: data.messages,
    };
};

// Update Title
export const updateChatTitle = async (chatId, title) => {
    const { data } = await api.put(`/${chatId}/title`, { title });
    return data.chat;
};

// Delete Chat
export const deleteChat = async (chatId) => {
    const { data } = await api.delete(`/${chatId}`);
    return data.message;
};
