import { useDispatch, useSelector } from "react-redux";
import {
    clearGuestChat as clearGuestChatApi,
    createGuest,
    deleteGuestChat as deleteGuestChatApi,
    getGuestChat,
    getGuestStatus,
    sendGuestMessage,
} from "../services/guest.api";
import {
    clearGuestError,
    resetGuestState,
    setGuestData,
    setGuestError,
    setGuestLoading,
    setGuestSending,
    setGuestStatus,
} from "../store/guestSlice";

const GUEST_CHAT_STORAGE_KEY = "nexa_guest_chat_id";

const getErrorMessage = (error, fallback) =>
    error.response?.data?.message || fallback;

const useGuest = () => {
    const dispatch = useDispatch();
    const guestState = useSelector((state) => state.guest);

    const runAsync = async (
        callback,
        fallbackMessage,
        loadingAction = setGuestLoading,
    ) => {
        dispatch(loadingAction(true));
        dispatch(setGuestError(null));

        try {
            return await callback();
        } catch (error) {
            dispatch(setGuestError(getErrorMessage(error, fallbackMessage)));
            throw error;
        } finally {
            dispatch(loadingAction(false));
        }
    };

    const loadGuestChat = async (chatId) =>
        runAsync(async () => {
            const data = await getGuestChat(chatId);
            dispatch(
                setGuestData({
                    guest: data.guest,
                    chat: data.chat,
                    messages: data.messages || [],
                    status: data.status,
                }),
            );
            window.localStorage.setItem(GUEST_CHAT_STORAGE_KEY, chatId);
            return data;
        }, "Failed to load guest chat");

    const startGuestSession = async (name) =>
        runAsync(async () => {
            const data = await createGuest({ name });
            if (data.chatId) {
                await loadGuestChat(data.chatId);
            }
            return data;
        }, "Failed to create guest session");

    const sendMessageAsGuest = async (chatId, message) =>
        runAsync(
            async () => {
                const data = await sendGuestMessage({
                    chatId,
                    message,
                });

                await loadGuestChat(chatId);
                return data;
            },
            "Failed to send guest message",
            setGuestSending,
        );

    const clearGuestConversation = async (chatId) =>
        runAsync(async () => {
            const data = await clearGuestChatApi(chatId);
            await loadGuestChat(chatId);
            return data;
        }, "Failed to clear guest chat");

    const deleteGuestConversation = async (chatId) =>
        runAsync(async () => {
            const data = await deleteGuestChatApi(chatId);
            window.localStorage.removeItem(GUEST_CHAT_STORAGE_KEY);
            dispatch(resetGuestState());
            return data;
        }, "Failed to delete guest chat");

    const fetchGuestMessageStatus = async (chatId) =>
        runAsync(async () => {
            const data = await getGuestStatus(chatId);
            dispatch(
                setGuestStatus({
                    messageCount: data.messageCount,
                    messageLimit: data.messageLimit,
                    remainingMessages: data.remainingMessages,
                }),
            );
            return data;
        }, "Failed to fetch guest status");

    const restoreGuestSession = async () => {
        const storedChatId = window.localStorage.getItem(GUEST_CHAT_STORAGE_KEY);
        if (!storedChatId) return null;

        try {
            return await loadGuestChat(storedChatId);
        } catch {
            window.localStorage.removeItem(GUEST_CHAT_STORAGE_KEY);
            dispatch(resetGuestState());
            return null;
        }
    };

    return {
        ...guestState,
        startGuestSession,
        loadGuestChat,
        sendMessageAsGuest,
        clearGuestConversation,
        deleteGuestConversation,
        fetchGuestMessageStatus,
        restoreGuestSession,
        clearGuestError: () => dispatch(clearGuestError()),
        resetGuestState: () => {
            window.localStorage.removeItem(GUEST_CHAT_STORAGE_KEY);
            dispatch(resetGuestState());
        },
    };
};

export default useGuest;
