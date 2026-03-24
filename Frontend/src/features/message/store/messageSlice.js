import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    attachments: [],
    streamedText: "",
    isAiThinking: false,
    loading: false,
    sending: false,
    error: null,
};

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setMessageLoading: (state, action) => {
            state.loading = action.payload;
        },
        setMessageSending: (state, action) => {
            state.sending = action.payload;
        },
        setMessageError: (state, action) => {
            state.error = action.payload;
        },
        clearMessageError: (state) => {
            state.error = null;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        updateMessageInState: (state, action) => {
            state.messages = state.messages.map((message) =>
                message._id === action.payload._id ? action.payload : message,
            );
        },
        removeMessageFromState: (state, action) => {
            state.messages = state.messages.filter(
                (message) => message._id !== action.payload,
            );
        },
        clearMessages: (state) => {
            state.messages = [];
            state.streamedText = "";
        },
        setAttachments: (state, action) => {
            state.attachments = action.payload;
        },
        clearAttachments: (state) => {
            state.attachments = [];
        },
        setStreamedText: (state, action) => {
            state.streamedText = action.payload;
        },
        setAiThinking: (state, action) => {
            state.isAiThinking = action.payload;
        },
    },
});

export const {
    addMessage,
    clearAttachments,
    clearMessageError,
    clearMessages,
    removeMessageFromState,
    setAttachments,
    setAiThinking,
    setMessageError,
    setMessageLoading,
    setMessageSending,
    setMessages,
    setStreamedText,
    updateMessageInState,
} = messageSlice.actions;

export default messageSlice.reducer;
