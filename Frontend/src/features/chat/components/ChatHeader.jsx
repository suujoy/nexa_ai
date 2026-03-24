import { useState } from "react";
import ChangeChatModel from "./ChangeChatModel";

const ChatHeader = ({
    chat,
    onRename,
    onTogglePin,
    onToggleArchive,
    onChangeModel,
    isBusy = false,
}) => {
    const [title, setTitle] = useState(chat?.title || "");

    if (!chat) return null;

    return (
        <div className="rounded-md border border-slate-200/80 bg-white/88 p-3 shadow-[0_14px_40px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:px-4 sm:py-3">
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-10 min-w-0 flex-1 rounded-sm border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-sky-400/40 dark:focus:ring-sky-400/10"
                />
                <div className="grid w-full grid-cols-4 gap-2 lg:flex lg:w-auto lg:items-center lg:gap-3">
                    <button
                        type="button"
                        disabled={isBusy || !title.trim()}
                        onClick={() => onRename?.(title)}
                        aria-label="Save chat title"
                        className="inline-flex h-10 w-full items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 lg:w-10"
                        title="Save"
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
                        onClick={() => onTogglePin?.(!chat.isPinned)}
                        aria-label={chat.isPinned ? "Unpin chat" : "Pin chat"}
                        className="inline-flex h-10 w-full items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 lg:w-10"
                        title={chat.isPinned ? "Unpin" : "Pin"}
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
                                d="M15 4v4l3 3H6l3-3V4z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v9" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => onToggleArchive?.(!chat.isArchived)}
                        aria-label={chat.isArchived ? "Restore chat" : "Archive chat"}
                        className="inline-flex h-10 w-full items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 lg:w-10"
                        title={chat.isArchived ? "Restore" : "Archive"}
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
                                d="M4 7h16M6 7l1 12h10l1-12M9 7V5h6v2"
                            />
                        </svg>
                    </button>
                    <ChangeChatModel
                        chat={chat}
                        onChangeModel={onChangeModel}
                        disabled={isBusy}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
