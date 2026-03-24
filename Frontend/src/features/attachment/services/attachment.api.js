import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

export const uploadAttachment = async (chatId, file, messageId) => {
    const formData = new FormData();
    formData.append("chatId", chatId);
    formData.append("file", file);

    if (messageId) {
        formData.append("messageId", messageId);
    }

    const { data } = await api.post("/api/attachment/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return data;
};

export const getAttachmentsByChat = async (chatId, params = {}) => {
    const { data } = await api.get(`/api/attachment/chat/${chatId}`, { params });
    return data;
};

export const getAttachmentsByMessage = async (messageId) => {
    const { data } = await api.get(`/api/attachment/message/${messageId}`);
    return data;
};

export const deleteAttachmentById = async (attachmentId) => {
    const { data } = await api.delete(`/api/attachment/delete/${attachmentId}`);
    return data;
};

export const deleteAttachmentsForChat = async (chatId) => {
    const { data } = await api.delete(`/api/attachment/chat/delete/${chatId}`);
    return data;
};

export const getAttachmentDownloadUrl = (attachmentId) =>
    `${import.meta.env.VITE_BASE_URL}/api/attachment/download/${attachmentId}`;
