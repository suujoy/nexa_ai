import { Link } from "react-router";
import ChatList from "./ChatList";
import ChatSidebarSection from "./ChatSidebarSection";

const ChatSidebar = ({
    chats,
    onCreateChat,
    onRenameChat,
    onDeleteChat,
    sidebarOpen = true,
    onSelectChat,
    className = "",
    headerContent = null,
}) => {
    return (
        <aside
            className={`flex min-h-0 flex-col rounded-md border border-slate-200/80 bg-white/88 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-950/72 dark:shadow-[0_24px_80px_rgba(0,0,0,0.35)] lg:sticky lg:top-5 lg:h-[calc(100svh-86px)] lg:overflow-hidden ${
                sidebarOpen ? "" : "hidden lg:flex"
            } ${className}`}
        >
            {headerContent ? <div className="mb-3">{headerContent}</div> : null}

            <button
                type="button"
                onClick={onCreateChat}
                className="rounded-sm mb-2 bg-[linear-gradient(135deg,#0891b2,#2563eb,#0f172a)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_14px_30px_rgba(8,145,178,0.22)]"
            >
                New
            </button>

            <div className="custom-scrollbar mt-1 flex-1 min-h-0 space-y-0 overflow-y-auto pr-1">
                <ChatSidebarSection title="All Chats" count={chats.length}>
                    <ChatList
                        chats={chats}
                        onRenameChat={onRenameChat}
                        onDeleteChat={onDeleteChat}
                        onSelectChat={onSelectChat}
                    />
                </ChatSidebarSection>
            </div>

            <div className="mt-3 rounded-sm border border-slate-200 bg-slate-50 px-3 py-3 dark:border-white/10 dark:bg-white/5">
                <Link
                    to="/ai-models"
                    onClick={onSelectChat}
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300"
                >
                    Manage AI Models
                </Link>
            </div>
        </aside>
    );
};

export default ChatSidebar;
