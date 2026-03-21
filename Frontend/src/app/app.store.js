import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import chatReducer from "../features/chat/chat.slice";
import themeReducer from "../features/theme/theme.slice";
import modelReducer from "../features/AiModels/aiModel.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        theme: themeReducer,
        model: modelReducer,
    },
});
