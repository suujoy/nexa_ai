import { createSlice } from "@reduxjs/toolkit";

const getInitialDarkMode = () => {
    if (typeof window === "undefined") {
        return false;
    }

    const storedTheme = window.localStorage.getItem("darkMode");

    if (storedTheme !== null) {
        return JSON.parse(storedTheme);
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const initialState = {
    darkMode: getInitialDarkMode(),
};

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.darkMode = !state.darkMode;
        },
        setDarkMode: (state, action) => {
            state.darkMode = action.payload;
        },
    },
});

export const { toggleTheme, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
