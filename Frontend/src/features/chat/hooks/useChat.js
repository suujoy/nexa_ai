import { useDispatch, useSelector } from "react-redux";
import {
    changeChatAiModel,
    createChat as createChatApi,
    deleteChatById,
    getArchivedChats,
    getChatDetail,
    getChats,
    getPinnedChats,
    updateChatArchive,
    updateChatPin,
    updateChatTitle,
} from "../services/chat.api";
import {
    addChat,
    clearChatError,
    removeChatFromState,
    setArchivedChats,
    setChatError,
    setChatLoading,
    setChats,
    setPinnedChats,
    setSelectedChat,
    setSidebarOpen,
    updateChatInState,
} from "../store/chatSlice";

const getErrorMessage = (error, fallback) =>
    error.response?.data?.message || fallback;

const useChat = () => {
    const dispatch = useDispatch();
    const chatState = useSelector((state) => state.chat);

    const runAsync = async (callback, fallbackMessage) => {
        dispatch(setChatLoading(true));
        dispatch(setChatError(null));

        try {
            return await callback();
        } catch (error) {
            dispatch(setChatError(getErrorMessage(error, fallbackMessage)));
            throw error;
        } finally {
            dispatch(setChatLoading(false));
        }
    };

    const fetchChats = async () =>
        runAsync(async () => {
            const data = await getChats();
            dispatch(setChats(data.chats || []));
            return data.chats || [];
        }, "Failed to fetch chats");

    const fetchPinnedChats = async () =>
        runAsync(async () => {
            try {
                const data = await getPinnedChats();
                dispatch(setPinnedChats(data.chats || []));
                return data.chats || [];
            } catch (error) {
                if (error.response?.status === 404) {
                    dispatch(setPinnedChats([]));
                    return [];
                }
                throw error;
            }
        }, "Failed to fetch pinned chats");

    const fetchArchivedChats = async () =>
        runAsync(async () => {
            try {
                const data = await getArchivedChats();
                dispatch(setArchivedChats(data.chats || []));
                return data.chats || [];
            } catch (error) {
                if (error.response?.status === 404) {
                    dispatch(setArchivedChats([]));
                    return [];
                }
                throw error;
            }
        }, "Failed to fetch archived chats");

    const fetchChatDetail = async (chatId) =>
        runAsync(async () => {
            const data = await getChatDetail(chatId);
            dispatch(setSelectedChat(data.chat || null));
            return data.chat || null;
        }, "Failed to fetch chat detail");

    const createChat = async (payload) =>
        runAsync(async () => {
            const data = await createChatApi(payload);
            if (data.chat) {
                dispatch(addChat(data.chat));
                dispatch(setSelectedChat(data.chat));
            }
            return data.chat || null;
        }, "Failed to create chat");

    const renameChat = async (chatId, title) =>
        runAsync(async () => {
            const data = await updateChatTitle(chatId, { title });
            if (data.chat) dispatch(updateChatInState(data.chat));
            return data.chat || null;
        }, "Failed to rename chat");

    const togglePinChat = async (chatId, isPinned) =>
        runAsync(async () => {
            const data = await updateChatPin(chatId, { isPinned });
            if (data.chat) dispatch(updateChatInState(data.chat));
            return data.chat || null;
        }, "Failed to update pinned chat");

    const toggleArchiveChat = async (chatId, isArchived) =>
        runAsync(async () => {
            const data = await updateChatArchive(chatId, { isArchived });
            if (data.chat) dispatch(updateChatInState(data.chat));
            return data.chat || null;
        }, "Failed to update archived chat");

    const updateChatModel = async (chatId, modelId) =>
        runAsync(async () => {
            const data = await changeChatAiModel(chatId, { modelId });
            if (data.chat) dispatch(updateChatInState(data.chat));
            return data.chat || null;
        }, "Failed to change chat model");

    const deleteChat = async (chatId) =>
        runAsync(async () => {
            const data = await deleteChatById(chatId);
            dispatch(removeChatFromState(chatId));
            return data;
        }, "Failed to delete chat");

    return {
        ...chatState,
        fetchChats,
        fetchPinnedChats,
        fetchArchivedChats,
        fetchChatDetail,
        createChat,
        renameChat,
        togglePinChat,
        toggleArchiveChat,
        updateChatModel,
        deleteChat,
        setSelectedChat: (chat) => dispatch(setSelectedChat(chat)),
        setSidebarOpen: (value) => dispatch(setSidebarOpen(value)),
        clearChatError: () => dispatch(clearChatError()),
    };
};

export default useChat;
