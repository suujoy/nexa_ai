import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

export const createAiModel = async ({ name, provider, model }) => {
    const { data } = await api.post("/api/aiModel/create", {
        name,
        provider,
        model,
    });
    return data;
};

export const getAiModels = async () => {
    const { data } = await api.get("/api/aiModel/all");
    return data;
};

export const getAiModelDetails = async (modelId) => {
    const { data } = await api.get(`/api/aiModel/detail/${modelId}`);
    return data;
};

export const updateActiveAiModel = async (modelId) => {
    const { data } = await api.patch(`/api/aiModel/active/${modelId}`);
    return data;
};

export const updateDefaultAiModel = async (modelId) => {
    const { data } = await api.patch(`/api/aiModel/default/${modelId}`);
    return data;
};

export const deleteAiModel = async (modelId) => {
    const { data } = await api.delete(`/api/aiModel/delete/${modelId}`);
    return data;
};

export const getAllActiveAiModels = async () => {
    const { data } = await api.get("/api/aiModel/active");
    return data;
};

export const currentDefaultAiModel = async () => {
    const { data } = await api.get("/api/aiModel/default");
    return data;
};
