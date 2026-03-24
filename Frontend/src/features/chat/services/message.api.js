import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

export const getMessages = async (chatId) => {
    const { data } = await api.get(`/api/message/get/${chatId}`);
    return data;
};

export const sendMessage = async (chatId, payload) => {
    const { data } = await api.post(`/api/message/send/${chatId}`, payload);
    return data;
};

export const uploadAttachment = async (chatId, file) => {
    const formData = new FormData();
    formData.append("chatId", chatId);
    formData.append("file", file);

    const { data } = await api.post("/api/attachment/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return data;
};
