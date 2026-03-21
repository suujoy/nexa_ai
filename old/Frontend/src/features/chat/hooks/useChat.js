import { useDispatch, useSelector } from "react-redux";

import {
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
    const { chats } = useSelector((state) => state.chat);
    const { currentChat } = useSelector((state) => state.chat);
    const { messages } = useSelector((state) => state.chat);
    const { loading } = useSelector((state) => state.chat);
    const { error } = useSelector((state) => state.chat);

    const handleCreateChat = async () => {
        try {
            dispatch(setLoading(true));

            const newChat = await createChat();

            dispatch(addChat(newChat));
            dispatch(setCurrentChat(newChat));
        } catch (err) {
            dispatch(setError(err.message));
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
            dispatch(setError(err.message));
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
            dispatch(setError(err.message));
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
            dispatch(setError(err.message));
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
            dispatch(setError(err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleSendMessage = async (chatId, message) => {
        try {
            dispatch(setLoading(true));

            const { userMessage, aiMessage } = await sendMessage(
                chatId,
                message,
            );

            dispatch(addMessage(userMessage));
            dispatch(addMessage(aiMessage));
        } catch (err) {
            dispatch(setError(err.message));
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

            dispatch(updateMessage(userMessage));
            dispatch(updateMessage(aiMessage));
        } catch (err) {
            dispatch(setError(err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            dispatch(setLoading(true));

            await deleteMessageAPI(messageId);

            dispatch(deleteMessage(messageId)); // removes user
            // AI message auto handled by reload OR pair logic later
        } catch (err) {
            dispatch(setError(err.message));
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
            dispatch(setError(err.message));
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
