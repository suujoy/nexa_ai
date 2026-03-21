import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { useChat } from "../hooks/useChat";

const Sidebar = () => {
    const {
        chats,
        currentChat,
        handleCreateChat,
        handleDeleteChat,
        handleUpdateChatTitle,
        handleGetSingleChat,
    } = useChat();

    const [editId, setEditId] = useState(null);
    const [editValue, setEditValue] = useState("");

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
        <aside className="w-72 min-h-screen text-slate-900 dark:text-slate-100">
            <div className="h-full border-r border-emerald-300/40 dark:border-emerald-400/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-emerald-600 dark:text-emerald-300">
                        Chats
                    </h2>

                    <button
                        onClick={handleCreateChat}
                        className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400"
                    >
                        <FaPlus />
                    </button>
                </div>

                {/* Chat List */}
                <div>
                    {chats.map((chat) => (
                        <div
                            key={chat._id}
                            onClick={() => handleGetSingleChat(chat._id)}
                            className={`
                group flex items-center justify-between
                p-3 cursor-pointer border-b
                border-slate-200 dark:border-slate-700
                hover:bg-slate-100 dark:hover:bg-slate-800
                ${
                    currentChat?._id === chat._id
                        ? "bg-slate-200 dark:bg-slate-800"
                        : ""
                }
              `}
                        >
                            {/* Title / Input */}
                            {editId === chat._id ? (
                                <input
                                    value={editValue}
                                    onChange={(e) =>
                                        setEditValue(e.target.value)
                                    }
                                    onBlur={() => saveEdit(chat._id)}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && saveEdit(chat._id)
                                    }
                                    autoFocus
                                    className="bg-transparent outline-none w-full"
                                />
                            ) : (
                                <p className="font-medium truncate">
                                    {chat.title}
                                </p>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        startEdit(chat);
                                    }}
                                    className="p-1 hover:text-emerald-500"
                                >
                                    <FaEdit size={14} />
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteChat(chat._id);
                                    }}
                                    className="p-1 hover:text-red-500"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
