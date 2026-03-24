import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    aiModels: [],
    activeAiModels: [],
    selectedAiModel: null,
    defaultAiModel: null,
    loading: false,
    error: null,
};

const aiModelSlice = createSlice({
    name: "aiModel",
    initialState,
    reducers: {
        setAiModelLoading: (state, action) => {
            state.loading = action.payload;
        },
        setAiModelError: (state, action) => {
            state.error = action.payload;
        },
        clearAiModelError: (state) => {
            state.error = null;
        },
        setAiModels: (state, action) => {
            state.aiModels = action.payload;
        },
        setActiveAiModels: (state, action) => {
            state.activeAiModels = action.payload;
        },
        setSelectedAiModel: (state, action) => {
            state.selectedAiModel = action.payload;
        },
        setDefaultAiModel: (state, action) => {
            state.defaultAiModel = action.payload;
        },
        addAiModel: (state, action) => {
            state.aiModels.unshift(action.payload);
        },
        updateAiModelInList: (state, action) => {
            state.aiModels = state.aiModels.map((model) =>
                model._id === action.payload._id ? action.payload : model,
            );
            state.activeAiModels = state.activeAiModels.map((model) =>
                model._id === action.payload._id ? action.payload : model,
            );

            if (state.selectedAiModel?._id === action.payload._id) {
                state.selectedAiModel = action.payload;
            }

            if (state.defaultAiModel?._id === action.payload._id) {
                state.defaultAiModel = action.payload;
            }
        },
        removeAiModelFromList: (state, action) => {
            state.aiModels = state.aiModels.filter(
                (model) => model._id !== action.payload,
            );
            state.activeAiModels = state.activeAiModels.filter(
                (model) => model._id !== action.payload,
            );

            if (state.selectedAiModel?._id === action.payload) {
                state.selectedAiModel = null;
            }

            if (state.defaultAiModel?._id === action.payload) {
                state.defaultAiModel = null;
            }
        },
    },
});

export const {
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
} = aiModelSlice.actions;

export default aiModelSlice.reducer;
