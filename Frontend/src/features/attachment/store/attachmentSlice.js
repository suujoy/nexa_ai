import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatAttachments: [],
    messageAttachments: [],
    loading: false,
    uploading: false,
    deleting: false,
    error: null,
};

const attachmentSlice = createSlice({
    name: "attachment",
    initialState,
    reducers: {
        setAttachmentLoading: (state, action) => {
            state.loading = action.payload;
        },
        setAttachmentUploading: (state, action) => {
            state.uploading = action.payload;
        },
        setAttachmentDeleting: (state, action) => {
            state.deleting = action.payload;
        },
        setAttachmentError: (state, action) => {
            state.error = action.payload;
        },
        clearAttachmentError: (state) => {
            state.error = null;
        },
        setChatAttachments: (state, action) => {
            state.chatAttachments = action.payload;
        },
        setMessageAttachments: (state, action) => {
            state.messageAttachments = action.payload;
        },
        addChatAttachment: (state, action) => {
            state.chatAttachments.unshift(action.payload);
        },
        removeChatAttachment: (state, action) => {
            state.chatAttachments = state.chatAttachments.filter(
                (attachment) => attachment._id !== action.payload,
            );
            state.messageAttachments = state.messageAttachments.filter(
                (attachment) => attachment._id !== action.payload,
            );
        },
        clearAttachmentsState: (state) => {
            state.chatAttachments = [];
            state.messageAttachments = [];
            state.error = null;
        },
    },
});

export const {
    addChatAttachment,
    clearAttachmentError,
    clearAttachmentsState,
    removeChatAttachment,
    setAttachmentDeleting,
    setAttachmentError,
    setAttachmentLoading,
    setAttachmentUploading,
    setChatAttachments,
    setMessageAttachments,
} = attachmentSlice.actions;

export default attachmentSlice.reducer;
