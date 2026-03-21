import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chats: [],
    currentChat: null,
    messages: [],
    loading: false,
    error: null,
};

export const chatSlice = createSlice({
    name: "chatSlice",
    initialState,
    reducers: {
        setChats(state, action) {
            state.chats = action.payload;
        },

        addChat(state, action) {
            state.chats.unshift(action.payload);
        },

        setCurrentChat(state, action) {
            state.currentChat = action.payload;
        },

        setMessages(state, action) {
            state.messages = action.payload;
        },

        addMessage(state, action) {
            state.messages.push(action.payload);
        },

        updateMessage(state, action) {
            const index = state.messages.findIndex(
                (msg) => msg._id === action.payload._id,
            );
            if (index !== -1) {
                state.messages[index] = action.payload;
            }
        },

        deleteMessage(state, action) {
            state.messages = state.messages.filter(
                (msg) => msg._id !== action.payload,
            );
        },

        updateChatTitle(state, action) {
            const chat = state.chats.find((c) => c._id === action.payload._id);
            if (chat) {
                chat.title = action.payload.title;
            }

            if (state.currentChat?._id === action.payload._id) {
                state.currentChat.title = action.payload.title;
            }
        },

        deleteChat(state, action) {
            state.chats = state.chats.filter(
                (chat) => chat._id !== action.payload,
            );

            if (state.currentChat?._id === action.payload) {
                state.currentChat = null;
                state.messages = [];
            }
        },

        setLoading(state, action) {
            state.loading = action.payload;
        },

        setError(state, action) {
            state.error = action.payload;
        },

        clearChatState(state) {
            state.chats = [];
            state.currentChat = null;
            state.messages = [];
            state.error = null;
        },
    },
});

export const {
    setChats,
    addChat,
    setCurrentChat,
    setMessages,
    addMessage,
    updateMessage,
    deleteMessage,
    updateChatTitle,
    deleteChat,
    setLoading,
    setError,
    clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
