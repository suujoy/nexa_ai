import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

export const getMessages = async (chatId, params = {}) => {
    const { data } = await api.get(`/api/message/get/${chatId}`, { params });
    return data;
};

export const sendMessage = async (chatId, payload) => {
    const url = chatId ? `/api/message/send/${chatId}` : "/api/message/send";
    const { data } = await api.post(url, payload);
    return data;
};

export const updateMessage = async (messageId, payload) => {
    const { data } = await api.patch(`/api/message/update/${messageId}`, payload);
    return data;
};

export const deleteMessage = async (messageId) => {
    const { data } = await api.delete(`/api/message/${messageId}`);
    return data;
};

export const deleteChatMessages = async (chatId) => {
    const { data } = await api.delete(`/api/message/chat/${chatId}`);
    return data;
};

export const streamMessage = (chatId, onChunk) =>
    new Promise((resolve, reject) => {
        const eventSource = new EventSource(
            `${import.meta.env.VITE_BASE_URL}/api/message/stream/${chatId}`,
            { withCredentials: true },
        );

        eventSource.onmessage = (event) => {
            if (event.data === "[DONE]") {
                eventSource.close();
                resolve();
                return;
            }

            try {
                const payload = JSON.parse(event.data);
                onChunk?.(payload.token || "");
            } catch (error) {
                eventSource.close();
                reject(error);
            }
        };

        eventSource.onerror = () => {
            eventSource.close();
            reject(new Error("Streaming connection failed"));
        };
    });
