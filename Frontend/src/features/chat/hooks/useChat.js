import { useDispatch, useSelector } from "react-redux";
import {
    setChats,
    addChat,
    setCurrentChat,
    setMessages,
    addMessage,
    deleteMessagePair,
    replaceMessagesAfterEdit,
    updateChatTitle,
    deleteChat,
    setLoading,
    setError,
} from "../chat.slice";
import {
    createChat,
    getAllChats,
    getSingleChat,
    deleteChat as deleteChatAPI,
    updateChatTitle as updateChatTitleAPI,
} from "../service/chat.api";
import {
    deleteMessage as deleteMessageAPI,
    getMessages,
    sendMessage,
    updateMessage as updateMessageAPI,
} from "../service/message.api";

export const useChat = () => {
    const dispatch = useDispatch();
    const chats = useSelector((state) => state.chat.chats);
    const currentChat = useSelector((state) => state.chat.currentChat);
    const messages = useSelector((state) => state.chat.messages);
    const loading = useSelector((state) => state.chat.loading);
    const error = useSelector((state) => state.chat.error);

    const handleCreateChat = async () => {
        try {
            dispatch(setLoading(true));
            const newChat = await createChat();
            dispatch(addChat(newChat));
            dispatch(setCurrentChat(newChat));
            dispatch(setMessages([]));
            return newChat; // ✅ return so callers can grab the _id
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleGetAllChats = async () => {
        try {
            dispatch(setLoading(true));
            const chats = await getAllChats();
            dispatch(setChats(chats));
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleGetSingleChat = async (chatId) => {
        try {
            dispatch(setLoading(true));
            const { chat, messages } = await getSingleChat(chatId);
            dispatch(setCurrentChat(chat));
            dispatch(setMessages(messages));
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleDeleteChat = async (chatId) => {
        try {
            dispatch(setLoading(true));
            await deleteChatAPI(chatId);
            dispatch(deleteChat(chatId));
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleUpdateChatTitle = async (chatId, title) => {
        try {
            dispatch(setLoading(true));
            const updatedChat = await updateChatTitleAPI(chatId, title);
            dispatch(updateChatTitle(updatedChat));
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleSendMessage = async (chatId, message) => {
        try {
            dispatch(setLoading(true));
            const { userMessage, aiMessage, chat } = await sendMessage(
                chatId,
                message,
            );
            dispatch(addMessage(userMessage));
            dispatch(addMessage(aiMessage));
            if (chat?.title) dispatch(updateChatTitle(chat));
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleUpdateMessage = async (messageId, content) => {
        try {
            dispatch(setLoading(true));
            const { userMessage, aiMessage } = await updateMessageAPI(
                messageId,
                content,
            );
            dispatch(replaceMessagesAfterEdit({ userMessage, aiMessage }));
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            dispatch(setLoading(true));
            const { deletedAiMessageId } = await deleteMessageAPI(messageId);
            dispatch(
                deleteMessagePair({
                    userMessageId: messageId,
                    aiMessageId: deletedAiMessageId,
                }),
            );
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleGetMessages = async (chatId) => {
        try {
            dispatch(setLoading(true));
            const messages = await getMessages(chatId);
            dispatch(setMessages(messages));
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        chats,
        currentChat,
        messages,
        loading,
        error,
        handleCreateChat,
        handleGetAllChats,
        handleGetSingleChat,
        handleDeleteChat,
        handleUpdateChatTitle,
        handleSendMessage,
        handleUpdateMessage,
        handleDeleteMessage,
        handleGetMessages,
    };
};
