import { useDispatch, useSelector } from "react-redux";
import {
    deleteAttachmentById as deleteAttachmentByIdApi,
    deleteAttachmentsForChat as deleteAttachmentsForChatApi,
    getAttachmentDownloadUrl,
    getAttachmentsByChat,
    getAttachmentsByMessage,
    uploadAttachment,
} from "../services/attachment.api";
import {
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
} from "../store/attachmentSlice";

const getErrorMessage = (error, fallback) =>
    error.response?.data?.message || fallback;

const useAttachment = () => {
    const dispatch = useDispatch();
    const attachmentState = useSelector((state) => state.attachment);

    const runAsync = async (callback, fallbackMessage, loadingAction) => {
        dispatch(loadingAction(true));
        dispatch(setAttachmentError(null));

        try {
            return await callback();
        } catch (error) {
            dispatch(setAttachmentError(getErrorMessage(error, fallbackMessage)));
            throw error;
        } finally {
            dispatch(loadingAction(false));
        }
    };

    const fetchChatAttachments = async (chatId, params = {}) =>
        runAsync(
            async () => {
                const data = await getAttachmentsByChat(chatId, params);
                dispatch(setChatAttachments(data.attachments || []));
                return data.attachments || [];
            },
            "Failed to fetch chat attachments",
            setAttachmentLoading,
        );

    const fetchMessageAttachments = async (messageId) =>
        runAsync(
            async () => {
                const data = await getAttachmentsByMessage(messageId);
                dispatch(setMessageAttachments(data.attachments || []));
                return data.attachments || [];
            },
            "Failed to fetch message attachments",
            setAttachmentLoading,
        );

    const uploadFilesToChat = async (chatId, files, messageId) =>
        runAsync(
            async () => {
                const uploaded = [];

                for (const file of files) {
                    const data = await uploadAttachment(chatId, file, messageId);
                    if (data.attachment) {
                        dispatch(addChatAttachment(data.attachment));
                    }
                    uploaded.push(data);
                }

                return uploaded;
            },
            "Failed to upload attachments",
            setAttachmentUploading,
        );

    const removeAttachmentById = async (attachmentId) =>
        runAsync(
            async () => {
                const data = await deleteAttachmentByIdApi(attachmentId);
                dispatch(removeChatAttachment(attachmentId));
                return data;
            },
            "Failed to delete attachment",
            setAttachmentDeleting,
        );

    const clearChatAttachments = async (chatId) =>
        runAsync(
            async () => {
                const data = await deleteAttachmentsForChatApi(chatId);
                dispatch(setChatAttachments([]));
                return data;
            },
            "Failed to clear attachments",
            setAttachmentDeleting,
        );

    return {
        ...attachmentState,
        fetchChatAttachments,
        fetchMessageAttachments,
        uploadFilesToChat,
        removeAttachmentById,
        clearChatAttachments,
        getDownloadUrl: getAttachmentDownloadUrl,
        clearAttachmentError: () => dispatch(clearAttachmentError()),
        clearAttachmentsState: () => dispatch(clearAttachmentsState()),
    };
};

export default useAttachment;
