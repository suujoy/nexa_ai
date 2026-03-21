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
            const i = state.messages.findIndex((m) => m._id === action.payload._id);
            if (i !== -1) state.messages[i] = action.payload;
        },
        // Removes user message + its paired AI message by id
        deleteMessagePair(state, action) {
            const { userMessageId, aiMessageId } = action.payload;
            state.messages = state.messages.filter(
                (m) => m._id !== userMessageId && m._id !== aiMessageId,
            );
        },
        // After edit: update user msg in place, trim stale messages after it, append new AI reply
        replaceMessagesAfterEdit(state, action) {
            const { userMessage, aiMessage } = action.payload;
            const idx = state.messages.findIndex((m) => m._id === userMessage._id);
            if (idx !== -1) {
                state.messages[idx] = userMessage;
                state.messages = state.messages.slice(0, idx + 1);
                state.messages.push(aiMessage);
            }
        },
        updateChatTitle(state, action) {
            const chat = state.chats.find((c) => c._id === action.payload._id);
            if (chat) chat.title = action.payload.title;
            if (state.currentChat?._id === action.payload._id) {
                state.currentChat.title = action.payload.title;
            }
        },
        deleteChat(state, action) {
            state.chats = state.chats.filter((c) => c._id !== action.payload);
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
            state.loading = false;
        },
    },
});

export const {
    setChats, addChat, setCurrentChat, setMessages, addMessage,
    updateMessage, deleteMessagePair, replaceMessagesAfterEdit,
    updateChatTitle, deleteChat, setLoading, setError, clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
