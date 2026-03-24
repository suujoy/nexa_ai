import { useDispatch, useSelector } from "react-redux";
import {
    createAiModel as createAiModelApi,
    currentDefaultAiModel,
    deleteAiModel as deleteAiModelApi,
    getAiModelDetails,
    getAiModels,
    getAllActiveAiModels,
    updateActiveAiModel as updateActiveAiModelApi,
    updateDefaultAiModel as updateDefaultAiModelApi,
} from "../services/aiModel.api";
import {
    addAiModel,
    clearAiModelError,
    removeAiModelFromList,
    setActiveAiModels,
    setAiModelError,
    setAiModelLoading,
    setAiModels,
    setDefaultAiModel,
    setSelectedAiModel,
    updateAiModelInList,
} from "../store/aiModelSlice";

const getErrorMessage = (error, fallback) =>
    error.response?.data?.message || fallback;

const useAiModel = () => {
    const dispatch = useDispatch();
    const aiModelState = useSelector((state) => state.aiModel);

    const runAsync = async (callback, fallbackMessage) => {
        dispatch(setAiModelLoading(true));
        dispatch(setAiModelError(null));

        try {
            return await callback();
        } catch (error) {
            dispatch(setAiModelError(getErrorMessage(error, fallbackMessage)));
            throw error;
        } finally {
            dispatch(setAiModelLoading(false));
        }
    };

    const fetchAiModels = async () =>
        runAsync(async () => {
            const data = await getAiModels();
            dispatch(setAiModels(data.models || []));
            return data.models || [];
        }, "Failed to fetch AI models");

    const fetchActiveAiModels = async () =>
        runAsync(async () => {
            const data = await getAllActiveAiModels();
            dispatch(setActiveAiModels(data.models || []));
            return data.models || [];
        }, "Failed to fetch active AI models");

    const fetchAiModelDetails = async (modelId) =>
        runAsync(async () => {
            const data = await getAiModelDetails(modelId);
            dispatch(setSelectedAiModel(data.model || null));
            return data.model || null;
        }, "Failed to fetch AI model details");

    const fetchDefaultAiModel = async () =>
        runAsync(async () => {
            const data = await currentDefaultAiModel();
            dispatch(setDefaultAiModel(data.model || null));
            return data.model || null;
        }, "Failed to fetch default AI model");

    const createAiModel = async (payload) =>
        runAsync(async () => {
            const data = await createAiModelApi(payload);
            if (data.model) {
                dispatch(addAiModel(data.model));
            }
            return data.model || null;
        }, "Failed to create AI model");

    const updateActiveAiModel = async (modelId) =>
        runAsync(async () => {
            const data = await updateActiveAiModelApi(modelId);
            if (data.model) {
                dispatch(updateAiModelInList(data.model));
            }
            return data.model || null;
        }, "Failed to update active AI model");

    const updateDefaultAiModel = async (modelId) =>
        runAsync(async () => {
            const data = await updateDefaultAiModelApi(modelId);
            if (data.model) {
                dispatch(setDefaultAiModel(data.model));
                dispatch(updateAiModelInList(data.model));
            }
            return data.model || null;
        }, "Failed to update default AI model");

    const deleteAiModel = async (modelId) =>
        runAsync(async () => {
            await deleteAiModelApi(modelId);
            dispatch(removeAiModelFromList(modelId));
            return modelId;
        }, "Failed to delete AI model");

    return {
        ...aiModelState,
        fetchAiModels,
        fetchActiveAiModels,
        fetchAiModelDetails,
        fetchDefaultAiModel,
        createAiModel,
        updateActiveAiModel,
        updateDefaultAiModel,
        deleteAiModel,
        setSelectedAiModel: (model) => dispatch(setSelectedAiModel(model)),
        clearAiModelError: () => dispatch(clearAiModelError()),
    };
};

export default useAiModel;
