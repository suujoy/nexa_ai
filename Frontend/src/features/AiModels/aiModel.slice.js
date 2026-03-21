import { createSlice } from "@reduxjs/toolkit";

const aiModelSlice = createSlice({
    name: "model",
    initialState: {
        selectedModel: "groq",
    },
    reducers: {
        setModel: (state, action) => {
            state.selectedModel = action.payload;
        },
    },
});

export const { setModel } = aiModelSlice.actions;
export default aiModelSlice.reducer;
