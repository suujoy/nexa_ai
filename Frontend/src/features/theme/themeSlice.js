import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
    return localStorage.getItem("theme") || "light";
};

export const themeSlice = createSlice({
    name: "theme",
    initialState: {
        theme: getInitialTheme(),
    },
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem("theme", action.payload);
        },
        toggleTheme: (state) => {
            state.theme = state.theme === "dark" ? "light" : "dark";
            localStorage.setItem("theme", state.theme);
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
