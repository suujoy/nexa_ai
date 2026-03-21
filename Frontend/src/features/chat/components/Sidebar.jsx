import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";

const Sidebar = () => {
    const {
        chats,
        currentChat,
        handleCreateChat,
        handleDeleteChat,
        handleUpdateChatTitle,
        handleGetSingleChat,
        handleGetAllChats,
    } = useChat();

    const selectedModel = useSelector((state) => state.model.selectedModel);

    const [editId, setEditId] = useState(null);
    const [editValue, setEditValue] = useState("");

    useEffect(() => {
        handleGetAllChats();
    }, []); // eslint-disable-line

    const startEdit = (chat) => {
        setEditId(chat._id);
        setEditValue(chat.title);
    };

    const saveEdit = (chatId) => {
        if (!editValue.trim()) return;
        handleUpdateChatTitle(chatId, editValue);
        setEditId(null);
    };

    return (
        <aside className="w-[240px] sm:w-64 md:w-72 h-full flex flex-col text-slate-900 dark:text-slate-100 border-r border-emerald-300/40 dark:border-emerald-400/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur flex-shrink-0">
            {/* HEADER */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-300">
                    Chats
                </h2>
                <button
                    onClick={() => handleCreateChat(selectedModel)}
                    className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400"
                    title={`New ${selectedModel} chat`}
                >
                    <FaPlus size={14} />
                </button>
            </div>

            {/* LIST */}
            <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => (
                    <div
                        key={chat._id}
                        onClick={() => handleGetSingleChat(chat._id)}
                        className={`group flex items-center justify-between gap-2 p-2 sm:p-3 cursor-pointer border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 ${
                            currentChat?._id === chat._id
                                ? "bg-slate-200 dark:bg-slate-800"
                                : ""
                        }`}
                    >
                        {editId === chat._id ? (
                            <input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={() => saveEdit(chat._id)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && saveEdit(chat._id)
                                }
                                autoFocus
                                className="bg-transparent outline-none w-full text-sm"
                            />
                        ) : (
                            <div className="flex flex-col min-w-0">
                                <p className="font-medium truncate text-sm sm:text-base">
                                    {chat.title || "New Chat"}
                                </p>
                                {chat.model && (
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 capitalize">
                                        {chat.model}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* ACTIONS */}
                        <div className="flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition flex-shrink-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    startEdit(chat);
                                }}
                                className="p-1 hover:text-emerald-500"
                            >
                                <FaEdit size={12} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteChat(chat._id);
                                }}
                                className="p-1 hover:text-red-500"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
