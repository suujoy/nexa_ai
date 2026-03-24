import { useState } from "react";

const futureTools = [
    "Image creation",
    "File analysis",
    "Voice input",
];

const ChatEmptyState = ({ onCreateChat, submitting = false }) => {
    const [message, setMessage] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        await onCreateChat?.(message.trim());
        setMessage("");
        setMenuOpen(false);
    };

    return (
        <div className="flex h-full min-h-0 flex-col justify-center rounded border border-slate-200/80 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_40%),linear-gradient(180deg,#eff8ff_0%,#e8f2ff_52%,#e5efff_100%)] p-3 shadow-[0_24px_80px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.1),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.98))] sm:p-6">
            <div className="mx-auto w-full max-w-4xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-600 dark:text-cyan-300">
                    Start A Conversation
                </p>
                <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white sm:text-xl">
                    Ask anything and open new tools from one input bar 
                </h2>
                
            </div>

            <form
                onSubmit={handleSubmit}
                className="relative mx-auto mt-6 w-full max-w-5xl  border border-slate-200/80 bg-white/70 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-[0_18px_60px_rgba(15,23,42,0.22)] rounded"
            >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setMenuOpen((open) => !open)}
                            className="grid h-12 w-12 place-items-center rounded border border-slate-300 bg-white text-slate-700 transition hover:border-cyan-300/60 hover:bg-cyan-50 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-cyan-400/10"
                            aria-label="Open feature menu"
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
                                    d="M12 5v14M5 12h14"
                                />
                            </svg>
                        </button>

                        {menuOpen ? (
                            <div className="absolute bottom-[calc(100%+12px)] left-0 z-30 min-w-[220px] rounded border border-white/10 bg-slate-950/95 p-2 shadow-[0_18px_50px_rgba(2,6,23,0.55)] backdrop-blur-xl">
                                {futureTools.map((tool) => (
                                    <button
                                        key={tool}
                                        type="button"
                                        className="flex w-full items-center justify-between rounded px-3 py-3 text-left text-sm text-slate-200 transition hover:bg-white/5"
                                    >
                                        <span>{tool}</span>
                                        <span className="text-[10px] uppercase tracking-[0.18em] text-cyan-300">
                                            Soon
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div className="flex-1">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Message Nexa AI..."
                            className="h-12 w-full rounded border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-slate-400"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || !message.trim()}
                        className="h-12 w-full rounded bg-[linear-gradient(135deg,#06b6d4,#2563eb,#1e293b)] px-6 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                        {submitting ? "Sending..." : "Send"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatEmptyState;
