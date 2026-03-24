import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    guest: null,
    chat: null,
    messages: [],
    status: {
        messageCount: 0,
        messageLimit: 10,
        remainingMessages: 10,
    },
    loading: false,
    sending: false,
    error: null,
};

const guestSlice = createSlice({
    name: "guest",
    initialState,
    reducers: {
        setGuestLoading: (state, action) => {
            state.loading = action.payload;
        },
        setGuestSending: (state, action) => {
            state.sending = action.payload;
        },
        setGuestError: (state, action) => {
            state.error = action.payload;
        },
        clearGuestError: (state) => {
            state.error = null;
        },
        setGuestData: (state, action) => {
            const { guest, chat, messages, status } = action.payload;
            state.guest = guest || null;
            state.chat = chat || null;
            state.messages = messages || [];
            if (status) {
                state.status = {
                    messageCount: status.messageCount ?? 0,
                    messageLimit: status.messageLimit ?? 10,
                    remainingMessages:
                        status.remainingMessages ??
                        Math.max((status.messageLimit ?? 10) - (status.messageCount ?? 0), 0),
                };
            }
        },
        setGuestMessages: (state, action) => {
            state.messages = action.payload;
        },
        setGuestStatus: (state, action) => {
            state.status = {
                messageCount: action.payload?.messageCount ?? 0,
                messageLimit: action.payload?.messageLimit ?? 10,
                remainingMessages: action.payload?.remainingMessages ?? 10,
            };
        },
        resetGuestState: () => initialState,
    },
});

export const {
    clearGuestError,
    resetGuestState,
    setGuestData,
    setGuestError,
    setGuestLoading,
    setGuestMessages,
    setGuestSending,
    setGuestStatus,
} = guestSlice.actions;

export default guestSlice.reducer;
