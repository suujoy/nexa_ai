import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "authSlice",
    initialState: {
        user: null,
        loading: true, // starts true — waiting for getMe on mount
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.error = null;
        },
        clearUser: (state) => {
            state.user = null;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setUser, clearUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
