import { useEffect, useState } from "react";
import { Link } from "react-router";
import Navbar from "../../../components/Navbar";
import MessageList from "../../message/components/MessageList";
import useGuest from "../hooks/useGuest";
import GuestComposer from "../components/GuestComposer";
import GuestCreateCard from "../components/GuestCreateCard";
import GuestStatusCard from "../components/GuestStatusCard";

const GuestChatPage = () => {
    const [showGuestPanel, setShowGuestPanel] = useState(false);
    const {
        guest,
        chat,
        messages,
        status,
        loading,
        sending,
        error,
        startGuestSession,
        sendMessageAsGuest,
        restoreGuestSession,
    } = useGuest();

    useEffect(() => {
        restoreGuestSession().catch(() => {});
    }, []);

    const handleCreate = async (name) => {
        await startGuestSession(name);
    };

    const handleSend = async (message) => {
        const chatId = chat?._id || chat?.id;
        if (!chatId) return;
        await sendMessageAsGuest(chatId, message);
    };

    const reachedLimit = (status?.remainingMessages ?? 0) <= 0;

    return (
        <div className="flex h-[100svh] min-h-[100svh] flex-col overflow-hidden bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#eef6ff_0%,#f8fbff_52%,#f2f7ff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#020617_0%,#07111f_52%,#020617_100%)]">
            <Navbar
                userName={guest?.name || "Guest"}
                onToggleSidebar={() => setShowGuestPanel(true)}
            />

            <section className="h-[calc(100svh-74px)] min-h-0 flex-1 overflow-hidden px-3 pb-3 pt-2 sm:h-[calc(100svh-84px)] sm:px-6 lg:px-8">
                <div className="mx-auto flex h-full min-h-0 max-w-[1700px] flex-col">
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            Guest mode lets you try the assistant without signing in.
                        </p>
                        <Link
                            to="/login"
                            className="text-sm font-semibold text-cyan-700 transition hover:text-slate-950 dark:text-cyan-300 dark:hover:text-white"
                        >
                            Go to Login
                        </Link>
                    </div>

                    {showGuestPanel ? (
                        <div className="fixed inset-0 z-[150] bg-slate-900/50 backdrop-blur-[1px] lg:hidden">
                            <div className="h-full w-[min(88vw,360px)] p-3">
                                <div className="custom-scrollbar h-full overflow-y-auto space-y-4 rounded-md border border-slate-200/80 bg-white/88 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-950/72 dark:shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
                                    <GuestCreateCard
                                        loading={loading}
                                        onCreate={handleCreate}
                                    />
                                    {chat ? (
                                    <GuestStatusCard
                                        status={status}
                                        chatTitle={chat.title}
                                    />
                                ) : null}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowGuestPanel(false)}
                                aria-label="Close session panel"
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

                    <div className="grid flex-1 min-h-0 gap-3 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
                        <div className="hidden space-y-4 pr-0 lg:custom-scrollbar lg:block lg:min-h-0 lg:overflow-y-auto lg:pr-1">
                            <GuestCreateCard loading={loading} onCreate={handleCreate} />
                            {chat ? (
                                <GuestStatusCard
                                    status={status}
                                    chatTitle={chat.title}
                                />
                            ) : null}
                        </div>

                        <div className="flex min-h-0 flex-col gap-3 overflow-hidden">
                            {error ? (
                                <div className="rounded-sm border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300">
                                    {error}
                                </div>
                            ) : null}

                            <MessageList
                                className="min-h-0 flex-1"
                                messages={messages}
                                loading={loading}
                            />

                            {chat ? (
                                <div className="shrink-0 pb-[max(0.2rem,env(safe-area-inset-bottom))]">
                                    <GuestComposer
                                        sending={sending}
                                        disabled={reachedLimit}
                                        onSend={handleSend}
                                    />
                                </div>
                            ) : (
                                <div className="rounded-sm border border-slate-200/80 bg-white/88 px-4 py-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                                    Create a guest session to start chatting.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GuestChatPage;
