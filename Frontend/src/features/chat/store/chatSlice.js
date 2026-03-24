import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chats: [],
    pinnedChats: [],
    archivedChats: [],
    selectedChat: null,
    loading: false,
    error: null,
    sidebarOpen: false,
};

const replaceChat = (list, updatedChat) =>
    list.map((chat) => (chat._id === updatedChat._id ? updatedChat : chat));
const filterChat = (list, chatId) => list.filter((chat) => chat._id !== chatId);

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setChatLoading: (state, action) => {
            state.loading = action.payload;
        },
        setChatError: (state, action) => {
            state.error = action.payload;
        },
        clearChatError: (state) => {
            state.error = null;
        },
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        setPinnedChats: (state, action) => {
            state.pinnedChats = action.payload;
        },
        setArchivedChats: (state, action) => {
            state.archivedChats = action.payload;
        },
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
        addChat: (state, action) => {
            state.chats.unshift(action.payload);
        },
        updateChatInState: (state, action) => {
            state.chats = replaceChat(state.chats, action.payload);
            state.pinnedChats = replaceChat(state.pinnedChats, action.payload);
            state.archivedChats = replaceChat(state.archivedChats, action.payload);

            if (state.selectedChat?._id === action.payload._id) {
                state.selectedChat = action.payload;
            }
        },
        removeChatFromState: (state, action) => {
            state.chats = filterChat(state.chats, action.payload);
            state.pinnedChats = filterChat(state.pinnedChats, action.payload);
            state.archivedChats = filterChat(state.archivedChats, action.payload);

            if (state.selectedChat?._id === action.payload) {
                state.selectedChat = null;
            }
        },
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload;
        },
    },
});

export const {
    addChat,
    clearChatError,
    setArchivedChats,
    setChatError,
    setChatLoading,
    setChats,
    setPinnedChats,
    removeChatFromState,
    setSelectedChat,
    setSidebarOpen,
    updateChatInState,
} = chatSlice.actions;

export default chatSlice.reducer;
