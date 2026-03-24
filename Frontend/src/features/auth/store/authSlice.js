import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    initialized: false,
    loading: false,
    error: null,
    successMessage: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthLoading: (state, action) => {
            state.loading = action.payload;
        },
        setAuthError: (state, action) => {
            state.error = action.payload;
        },
        clearAuthError: (state) => {
            state.error = null;
        },
        setAuthSuccessMessage: (state, action) => {
            state.successMessage = action.payload;
        },
        clearAuthSuccessMessage: (state) => {
            state.successMessage = null;
        },
        setAuthUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = Boolean(action.payload);
        },
        setAuthInitialized: (state, action) => {
            state.initialized = action.payload;
        },
        clearAuthUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const {
    clearAuthError,
    setAuthInitialized,
    clearAuthSuccessMessage,
    clearAuthUser,
    setAuthError,
    setAuthLoading,
    setAuthSuccessMessage,
    setAuthUser,
} = authSlice.actions;

export default authSlice.reducer;
