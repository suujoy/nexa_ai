import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../../components/Navbar";
import useAuth from "../../auth/hooks/useAuth";
import useMessage from "../../message/hooks/useMessage";
import ChatEmptyState from "../components/ChatEmptyState";
import ChatSidebar from "../components/ChatSidebar";
import useChat from "../hooks/useChat";

const ChatHomePage = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();
    const { sendMessage, sending: sendingMessage } = useMessage();
    const {
        chats,
        pinnedChats,
        archivedChats,
        loading,
        fetchChats,
        fetchPinnedChats,
        fetchArchivedChats,
        createChat,
        renameChat,
        deleteChat,
    } = useChat();

    useEffect(() => {
        fetchChats().catch(() => {});
        fetchPinnedChats().catch(() => {});
        fetchArchivedChats().catch(() => {});
    }, []);

    const handleCreateChat = async () => {
        try {
            const chat = await createChat({});
            if (chat?._id) {
                navigate(`/chat/${chat._id}`);
                setSidebarOpen(false);
            }
        } catch {
            // handled in hook state
        }
    };

    const handleStartConversation = async (initialMessage) => {
        try {
            const data = await sendMessage(null, {
                message: initialMessage,
                files: [],
            });

            await fetchChats();
            await fetchPinnedChats();
            await fetchArchivedChats();

            if (data?.chatId) {
                navigate(`/chat/${data.chatId}`, {
                    state: {
                        initialUserMessage: initialMessage,
                        initialAiResponse: data.message || "",
                        skipInitialFetch: true,
                    },
                });
            }
        } catch {
            // handled in hook state
        }
    };

    const handleRenameFromSidebar = async (chatId, title) => {
        await renameChat(chatId, title);
        await fetchChats();
        await fetchPinnedChats();
        await fetchArchivedChats();
    };

    const handleDeleteFromSidebar = async (chat) => {
        const confirmed = window.confirm(
            `Delete "${chat.title}"? This action cannot be undone.`,
        );
        if (!confirmed) return;
        await deleteChat(chat._id);
        await fetchChats();
        await fetchPinnedChats();
        await fetchArchivedChats();
    };

    return (
        <div className="flex h-[100dvh] flex-col overflow-hidden bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#eef6ff_0%,#f8fbff_52%,#f2f7ff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#020617_0%,#07111f_52%,#020617_100%)]">
            <Navbar
                userName={user?.name || "User"}
                pinnedChats={pinnedChats}
                archivedChats={archivedChats}
                onToggleSidebar={() => setSidebarOpen(true)}
            />

            <section className="min-h-0 flex-1 px-3 pb-3 pt-2 sm:px-6 lg:px-8">
                <div className="mx-auto h-full max-w-[1700px]">
                    {sidebarOpen ? (
                        <div className="fixed inset-0 z-[150] bg-slate-900/50 backdrop-blur-[1px] lg:hidden">
                            <div className="h-full w-[min(88vw,360px)] p-3">
                                <ChatSidebar
                                    chats={chats}
                                    onCreateChat={handleCreateChat}
                                    onRenameChat={handleRenameFromSidebar}
                                    onDeleteChat={handleDeleteFromSidebar}
                                    onSelectChat={() => setSidebarOpen(false)}
                                    className="h-full"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                aria-label="Close sidebar"
                                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-slate-900/80 text-white"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-5 w-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M18 6L6 18M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    ) : null}

                    <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
                        <ChatSidebar
                            chats={chats}
                            onCreateChat={handleCreateChat}
                            onRenameChat={handleRenameFromSidebar}
                            onDeleteChat={handleDeleteFromSidebar}
                            onSelectChat={() => setSidebarOpen(false)}
                            className="hidden lg:flex"
                        />

                        {loading && !chats.length ? (
                            <div className="rounded-md border border-slate-200/80 bg-white/88 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                                Loading chat workspace...
                            </div>
                        ) : (
                            <div className="h-full min-h-0">
                                <ChatEmptyState
                                    onCreateChat={handleStartConversation}
                                    submitting={sendingMessage}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ChatHomePage;
