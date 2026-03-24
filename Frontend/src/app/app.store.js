import { configureStore } from "@reduxjs/toolkit";
import aiModelReducer from "../features/aiModel/store/aiModelSlice";
import attachmentReducer from "../features/attachment/store/attachmentSlice";
import authReducer from "../features/auth/store/authSlice";
import chatReducer from "../features/chat/store/chatSlice";
import guestReducer from "../features/guest/store/guestSlice";
import messageReducer from "../features/message/store/messageSlice";
import themeReducer from "../features/theme/themeSlice";

export const store = configureStore({
    reducer: {
        aiModel: aiModelReducer,
        attachment: attachmentReducer,
        auth: authReducer,
        chat: chatReducer,
        guest: guestReducer,
        message: messageReducer,
        theme: themeReducer,
    },
});
