import { useDispatch, useSelector } from "react-redux";
import {
    deleteChatMessages as deleteChatMessagesApi,
    deleteMessage as deleteMessageApi,
    getMessages as getMessagesApi,
    sendMessage as sendMessageApi,
    streamMessage as streamMessageApi,
    updateMessage as updateMessageApi,
} from "../services/message.api";
import { uploadAttachment } from "../../attachment/services/attachment.api";
import {
    addMessage,
    clearMessageError,
    clearMessages,
    removeMessageFromState,
    setAiThinking,
    setMessageError,
    setMessageLoading,
    setMessageSending,
    setMessages,
    setStreamedText,
} from "../store/messageSlice";

const getErrorMessage = (error, fallback) =>
    error.response?.data?.message || fallback;

const useMessage = () => {
    const dispatch = useDispatch();
    const messageState = useSelector((state) => state.message);

    const runAsync = async (
        callback,
        fallbackMessage,
        setLoadingAction = setMessageLoading,
    ) => {
        dispatch(setLoadingAction(true));
        dispatch(setMessageError(null));

        try {
            return await callback();
        } catch (error) {
            dispatch(setMessageError(getErrorMessage(error, fallbackMessage)));
            throw error;
        } finally {
            dispatch(setLoadingAction(false));
        }
    };

    const fetchMessages = async (chatId, params) =>
        runAsync(async () => {
            const data = await getMessagesApi(chatId, params);
            dispatch(setMessages(data.messages || []));
            return data.messages || [];
        }, "Failed to fetch messages");

    const sendMessage = async (
        chatId,
        { message = "", files = [], stream = false },
    ) =>
        runAsync(
            async () => {
                const resolvedChatId = chatId || null;
                const trimmedMessage = message.trim();
                let optimisticId = null;
                let streamedOutput = "";

                for (const file of files) {
                    if (!resolvedChatId) break;
                    await uploadAttachment(resolvedChatId, file);
                }

                if (!trimmedMessage) {
                    return null;
                }

                if (stream && resolvedChatId) {
                    optimisticId = `temp-user-${Date.now()}`;
                    dispatch(
                        addMessage({
                            _id: optimisticId,
                            role: "user",
                            content: trimmedMessage,
                            status: "pending",
                        }),
                    );
                    dispatch(setStreamedText(""));
                    dispatch(setAiThinking(true));
                }

                try {
                    const data = await sendMessageApi(resolvedChatId, {
                        message: trimmedMessage,
                        stream,
                    });

                    if (stream && data?.chatId) {
                        await streamMessageApi(data.chatId, (token) => {
                            streamedOutput += token;
                            dispatch(setStreamedText(streamedOutput));
                        });
                    }

                    if (data?.chatId) {
                        await fetchMessages(data.chatId);
                    } else if (resolvedChatId) {
                        await fetchMessages(resolvedChatId);
                    }
                    if (stream) {
                        dispatch(setStreamedText(""));
                    }

                    return data;
                } catch (error) {
                    if (optimisticId) {
                        dispatch(removeMessageFromState(optimisticId));
                    }
                    dispatch(setStreamedText(""));
                    dispatch(setAiThinking(false));
                    throw error;
                } finally {
                    if (stream) {
                        dispatch(setAiThinking(false));
                    }
                }
            },
            "Failed to send message",
            setMessageSending,
        );

    const editMessage = async (messageId, content, chatId) =>
        runAsync(async () => {
            const data = await updateMessageApi(messageId, { content });

            if (chatId) {
                await fetchMessages(chatId);
            }

            return data;
        }, "Failed to update message");

    const removeMessage = async (messageId) =>
        runAsync(async () => {
            const data = await deleteMessageApi(messageId);
            dispatch(removeMessageFromState(messageId));
            return data;
        }, "Failed to delete message");

    const clearChatMessages = async (chatId) =>
        runAsync(async () => {
            const data = await deleteChatMessagesApi(chatId);
            dispatch(clearMessages());
            return data;
        }, "Failed to clear messages");

    const uploadFiles = async (chatId, files) =>
        runAsync(async () => {
            const uploaded = [];

            for (const file of files) {
                uploaded.push(await uploadAttachment(chatId, file));
            }

            return uploaded;
        }, "Failed to upload attachments");

    const streamMessage = async (chatId) =>
        runAsync(async () => {
            let nextText = "";
            dispatch(setStreamedText(""));
            dispatch(setAiThinking(true));

            try {
                await streamMessageApi(chatId, (token) => {
                    nextText += token;
                    dispatch(setStreamedText(nextText));
                });

                await fetchMessages(chatId);
                dispatch(setStreamedText(""));
            } finally {
                dispatch(setAiThinking(false));
            }
        }, "Failed to stream message");

    return {
        ...messageState,
        fetchMessages,
        sendMessage,
        editMessage,
        removeMessage,
        clearChatMessages,
        uploadFiles,
        streamMessage,
        setMessages: (messages) => dispatch(setMessages(messages)),
        setStreamedText: (text) => dispatch(setStreamedText(text)),
        setAiThinking: (value) => dispatch(setAiThinking(value)),
        clearMessages: () => dispatch(clearMessages()),
        clearMessageError: () => dispatch(clearMessageError()),
    };
};

export default useMessage;
