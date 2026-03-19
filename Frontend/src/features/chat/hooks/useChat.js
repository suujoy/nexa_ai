import { initializeSocketConnection } from "../service/chat.socket";
import {
    sendMessage,
    getChats,
    getMessages,
    deleteChat,
} from "../service/chat.api";
import { useDispatch, useSelector } from "react-redux";

import {
    setChats,
    setError,
    setLoading,
    setCurrentChatId,
} from "../chat.slice";

export const useChat = () => {
    const dispatch = useDispatch();
    const chats = useSelector((state) => state.chat.chats);

    const handleSendMessage = async ({ message, chatId }) => {
        try {
            dispatch(setLoading(true));
            const data = await sendMessage({ message, chatId });
            const { chat, aiMessage } = data;
            const existingMessages = chats?.[chat._id]?.messages || [];

            dispatch(
                setChats({
                    ...chats,
                    [chat._id]: {
                        ...chat,
                        messages: [
                            ...existingMessages,
                            { content: message, role: "user" },
                            aiMessage,
                        ],
                    },
                }),
            );
            dispatch(setCurrentChatId(chat._id));
        } catch (err) {
            dispatch(
                setError(
                    err?.response?.data?.message ||
                        err?.message ||
                        "Something went wrong",
                ),
            );
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        initializeSocketConnection,
        handleSendMessage,
    };
};
