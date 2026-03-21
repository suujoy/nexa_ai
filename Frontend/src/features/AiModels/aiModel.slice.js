import { createSlice } from "@reduxjs/toolkit";

const modelSlice = createSlice({
    name: "model",
    initialState: { selectedModel: "groq" },
    reducers: {
        setModel: (state, action) => {
            state.selectedModel = action.payload;
        },
    },
});

export const { setModel } = modelSlice.actions;
export default modelSlice.reducer;