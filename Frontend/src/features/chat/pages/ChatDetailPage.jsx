import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import Navbar from "../../../components/Navbar";
import useAuth from "../../auth/hooks/useAuth";
import ChatHeader from "../components/ChatHeader";
import ChatSidebar from "../components/ChatSidebar";
import useChat from "../hooks/useChat";
import MessageComposer from "../../message/components/MessageComposer";
import MessageList from "../../message/components/MessageList";
import useMessage from "../../message/hooks/useMessage";
import useAttachment from "../../attachment/hooks/useAttachment";
import AttachmentGallery from "../../attachment/components/AttachmentGallery";

const ChatDetailPage = () => {
    const { chatId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const initialMessageSentRef = useRef(false);
    const streamTimerRef = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();
    const {
        chats,
        pinnedChats,
        archivedChats,
        selectedChat,
        loading,
        error,
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
    } = useChat();
    const {
        messages,
        loading: messageLoading,
        sending: sendingMessage,
        streamedText,
        isAiThinking,
        fetchMessages,
        sendMessage,
        setMessages,
        setStreamedText,
        clearMessages,
    } = useMessage();
    const {
        chatAttachments,
        loading: attachmentLoading,
        deleting: attachmentDeleting,
        fetchChatAttachments,
        removeAttachmentById,
        getDownloadUrl,
        clearAttachmentsState,
    } = useAttachment();

    const refreshLists = async () => {
        await fetchChats();
        await fetchPinnedChats();
        await fetchArchivedChats();
        if (chatId) {
            await fetchChatDetail(chatId);
            await fetchMessages(chatId);
            await fetchChatAttachments(chatId).catch(() => {});
        }
    };

    useEffect(() => {
        fetchChats().catch(() => {});
        fetchPinnedChats().catch(() => {});
        fetchArchivedChats().catch(() => {});
    }, []);

    useEffect(() => {
        const skipInitialFetch = location.state?.skipInitialFetch;

        if (chatId) {
            fetchChatDetail(chatId).catch(() => {});
            if (!skipInitialFetch) {
                fetchMessages(chatId).catch(() => {});
            }
            fetchChatAttachments(chatId).catch(() => {});
        } else {
            clearMessages();
            clearAttachmentsState();
        }
    }, [chatId, location.state]);

    useEffect(() => {
        setSidebarOpen(false);
    }, [chatId]);

    useEffect(() => {
        const initialUserMessage = location.state?.initialUserMessage;
        const initialAiResponse = location.state?.initialAiResponse;

        if (
            !chatId ||
            !initialUserMessage ||
            !initialAiResponse ||
            initialMessageSentRef.current
        ) {
            return;
        }

        initialMessageSentRef.current = true;
        setMessages([
            {
                _id: `temp-user-${chatId}`,
                role: "user",
                content: initialUserMessage,
            },
        ]);
        setStreamedText("");

        let currentIndex = 0;

        streamTimerRef.current = window.setInterval(() => {
            currentIndex += 1;
            setStreamedText(initialAiResponse.slice(0, currentIndex));

            if (currentIndex >= initialAiResponse.length) {
                window.clearInterval(streamTimerRef.current);
                streamTimerRef.current = null;

                fetchMessages(chatId)
                    .then(() => refreshLists())
                    .finally(() => {
                        setStreamedText("");
                        navigate(`/chat/${chatId}`, { replace: true });
                    });
            }
        }, 18);

        return () => {
            if (streamTimerRef.current) {
                window.clearInterval(streamTimerRef.current);
                streamTimerRef.current = null;
            }
        };
    }, [chatId, location.state]);

    const handleCreateChat = async () => {
        const chat = await createChat({});
        await fetchChats();
        if (chat?._id) {
            navigate(`/chat/${chat._id}`);
        }
    };

    const handleSendMessage = async ({ message, files }) => {
        if (!chatId) return;
        await sendMessage(chatId, { message, files, stream: true });
        await refreshLists();
    };

    const handleRenameFromSidebar = async (chatIdFromList, title) => {
        await renameChat(chatIdFromList, title);
        await refreshLists();
    };

    const handleDeleteFromSidebar = async (chat) => {
        const confirmed = window.confirm(
            `Delete "${chat.title}"? This action cannot be undone.`,
        );
        if (!confirmed) return;
        await deleteChat(chat._id);
        if (chat._id === chatId) {
            navigate("/chat");
            return;
        }
        await refreshLists();
    };

    return (
        <div className="flex h-[100svh] min-h-[100svh] flex-col bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#eef6ff_0%,#f8fbff_52%,#f2f7ff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#020617_0%,#07111f_52%,#020617_100%)]">
            <Navbar
                userName={user?.name || "User"}
                pinnedChats={pinnedChats}
                archivedChats={archivedChats}
                onToggleSidebar={() => setSidebarOpen(true)}
            />

            <section className="min-h-0 flex-1 px-3 pb-2 pt-2 sm:px-6 lg:px-8">
                <div className="mx-auto h-full max-w-[1700px] min-h-0">
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
                                    headerContent={
                                        selectedChat ? (
                                            <ChatHeader
                                                chat={selectedChat}
                                                isBusy={loading}
                                                onRename={async (title) => {
                                                    await renameChat(chatId, title);
                                                    await refreshLists();
                                                }}
                                                onTogglePin={async (isPinned) => {
                                                    await togglePinChat(
                                                        chatId,
                                                        isPinned,
                                                    );
                                                    await refreshLists();
                                                }}
                                                onToggleArchive={async (
                                                    isArchived,
                                                ) => {
                                                    await toggleArchiveChat(
                                                        chatId,
                                                        isArchived,
                                                    );
                                                    await refreshLists();
                                                }}
                                                onChangeModel={async (modelId) => {
                                                    await updateChatModel(
                                                        chatId,
                                                        modelId,
                                                    );
                                                    await refreshLists();
                                                }}
                                            />
                                        ) : null
                                    }
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

                        <div className="flex min-h-0 flex-col gap-0">
                            {error ? (
                                <div className="rounded-sm border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300">
                                    {error}
                                </div>
                            ) : null}

                            {selectedChat ? (
                                <>
                                    <div className="hidden lg:block">
                                        <ChatHeader
                                            chat={selectedChat}
                                            isBusy={loading}
                                            onRename={async (title) => {
                                                await renameChat(chatId, title);
                                                await refreshLists();
                                            }}
                                            onTogglePin={async (isPinned) => {
                                                await togglePinChat(chatId, isPinned);
                                                await refreshLists();
                                            }}
                                            onToggleArchive={async (
                                                isArchived,
                                            ) => {
                                                await toggleArchiveChat(
                                                    chatId,
                                                    isArchived,
                                                );
                                                await refreshLists();
                                            }}
                                            onChangeModel={async (modelId) => {
                                                await updateChatModel(
                                                    chatId,
                                                    modelId,
                                                );
                                                await refreshLists();
                                            }}
                                        />
                                    </div>
                                    <MessageList
                                        className="min-h-0 flex-1"
                                        messages={messages}
                                        loading={messageLoading}
                                        streamedText={streamedText}
                                        isAiThinking={isAiThinking}
                                    />
                                    <AttachmentGallery
                                        attachments={chatAttachments}
                                        loading={attachmentLoading}
                                        deleting={attachmentDeleting}
                                        onDelete={removeAttachmentById}
                                        getDownloadUrl={getDownloadUrl}
                                    />
                                    <MessageComposer
                                        onSend={handleSendMessage}
                                        sending={sendingMessage}
                                    />
                                </>
                            ) : (
                                <div className="rounded-md border border-slate-200/80 bg-white/88 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                                    {loading
                                        ? "Loading chat detail..."
                                        : "Chat not found."}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ChatDetailPage;
