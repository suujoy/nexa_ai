import axios from "axios";

const api = axios.create({
    baseURL: "https://nexa-ai-v1j9.onrender.com",
    withCredentials: true,
});

export const sendMessage = async (chatId, message) => {
    const { data } = await api.post(`/${chatId}`, { message });
    return {
        userMessage: data.userMessage,
        aiMessage: data.aiMessage,
        chat: data.chat,
    };
};

export const getMessages = async (chatId) => {
    const { data } = await api.get(`/messages/${chatId}`);
    return data.messages;
};

export const updateMessage = async (messageId, content) => {
    const { data } = await api.patch(`/messages/update/${messageId}`, {
        content,
    });
    return { userMessage: data.userMessage, aiMessage: data.aiMessage };
};

export const deleteMessage = async (messageId) => {
    const { data } = await api.delete(`/messages/${messageId}`);
    return { deletedAiMessageId: data.deletedAiMessageId || null };
};
