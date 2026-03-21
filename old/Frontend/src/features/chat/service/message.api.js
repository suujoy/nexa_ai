import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/message",
    withCredentials: true,
});

// Send message (returns TWO messages)
export const sendMessage = async (chatId, message) => {
    const { data } = await api.post(`/${chatId}`, { message });
    return {
        userMessage: data.userMessage,
        aiMessage: data.aiMessage,
    };
};

// Get all messages
export const getMessages = async (chatId) => {
    const { data } = await api.get(`/messages/${chatId}`);
    return data.messages;
};

// Update message (returns updated user + ai)
export const updateMessage = async (messageId, content) => {
    const { data } = await api.patch(`/messages/update/${messageId}`, {
        content,
    });
    return {
        userMessage: data.userMessage,
        aiMessage: data.aiMessage,
    };
};

// Delete message (no message object returned)
export const deleteMessage = async (messageId) => {
    const { data } = await api.delete(`/messages/${messageId}`);
    return data.message;
};
