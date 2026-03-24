import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const ChatListItem = ({ chat, onRenameChat, onDeleteChat, onSelectChat }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = location.pathname === `/chat/${chat._id}`;
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(chat.title || "");
    const [saving, setSaving] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        setTitle(chat.title || "");
    }, [chat.title]);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const submitRename = async () => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle || trimmedTitle === chat.title) {
            setIsEditing(false);
            setTitle(chat.title || "");
            return;
        }

        try {
            setSaving(true);
            await onRenameChat?.(chat._id, trimmedTitle);
            setIsEditing(false);
        } finally {
            setSaving(false);
        }
    };

    const cancelRename = () => {
        setTitle(chat.title || "");
        setIsEditing(false);
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => {
                if (!isEditing) {
                    navigate(`/chat/${chat._id}`);
                    onSelectChat?.();
                }
            }}
            onKeyDown={(e) => {
                if (isEditing) return;
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/chat/${chat._id}`);
                    onSelectChat?.();
                }
            }}
            className={`group block rounded-sm border px-3 py-3 transition ${
                isActive
                    ? "border-sky-300 bg-sky-50 dark:border-sky-400/40 dark:bg-sky-400/10"
                    : "border-slate-200 bg-white/80 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
            }`}
        >
            <div className="flex items-start justify-between gap-0">
                <div className="min-w-0">
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                                e.stopPropagation();
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    submitRename();
                                }
                                if (e.key === "Escape") {
                                    e.preventDefault();
                                    cancelRename();
                                }
                            }}
                            className="w-full rounded-sm border border-slate-300 bg-white px-2 py-1 text-sm font-semibold text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-sky-400/40 dark:focus:ring-sky-400/10"
                        />
                    ) : (
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {chat.title}
                        </p>
                    )}
                    <p className="mt-0 truncate text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        {chat.model?.name || chat.model?.model || "AI Model"}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    submitRename();
                                }}
                                disabled={saving}
                                className="text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200"
                                aria-label="Save title"
                                title="Save title"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-4 w-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M20 6L9 17l-5-5"
                                    />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    cancelRename();
                                }}
                                disabled={saving}
                                className="text-slate-500 transition hover:text-slate-700 dark:text-slate-300 dark:hover:text-white"
                                aria-label="Cancel edit"
                                title="Cancel edit"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-4 w-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M18 6L6 18M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditing(true);
                                }}
                                className="rounded-sm p-1 text-slate-500 opacity-100 transition hover:bg-slate-100 hover:text-sky-700 focus:bg-slate-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-cyan-200 dark:focus:bg-white/10"
                                aria-label="Rename chat"
                                title="Rename chat"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-4 w-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.862 3.487a2.02 2.02 0 112.857 2.856L7.55 18.512 3 19.5l.988-4.55L16.862 3.487z"
                                    />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteChat?.(chat);
                                }}
                                className="rounded-sm p-1 text-slate-500 opacity-100 transition hover:bg-rose-50 hover:text-rose-600 focus:bg-rose-50 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 dark:text-slate-200 dark:hover:bg-rose-400/10 dark:hover:text-rose-300 dark:focus:bg-rose-400/10"
                                aria-label="Delete chat"
                                title="Delete chat"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-4 w-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V5h6v2"
                                    />
                                </svg>
                            </button>
                        </>
                    )}
                    {chat.isPinned ? (
                        <span className="rounded-sm bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                            Pin
                        </span>
                    ) : null}
                    {chat.isArchived ? (
                        <span className="rounded-sm bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600 dark:bg-white/10 dark:text-slate-300">
                            Arc
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ChatListItem;
