import { useRef, useState } from "react";

const GuestComposer = ({ onSend, sending = false, disabled = false }) => {
    const [message, setMessage] = useState("");
    const textareaRef = useRef(null);

    const submitMessage = async (event) => {
        event.preventDefault();
        const trimmed = message.trim();
        if (!trimmed || sending || disabled) return;

        await onSend?.(trimmed);
        setMessage("");

        window.requestAnimationFrame(() => {
            textareaRef.current?.focus();
        });
    };

    return (
        <form
            onSubmit={submitMessage}
            className="rounded-sm border border-slate-200/80 bg-white/88 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 dark:shadow-none"
        >
            <div className="flex items-end gap-3">
                <textarea
                    ref={textareaRef}
                    rows="1"
                    value={message}
                    disabled={disabled}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            submitMessage(event);
                        }
                    }}
                    placeholder={
                        disabled
                            ? "Guest message limit reached"
                            : "Send a guest message..."
                    }
                    className="min-h-[46px] flex-1 resize-none rounded-sm border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-sky-400/40 dark:focus:ring-sky-400/10"
                />
                <button
                    type="submit"
                    disabled={sending || disabled}
                    className="rounded-sm bg-[linear-gradient(135deg,#0891b2,#2563eb,#0f172a)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {sending ? "Sending..." : "Send"}
                </button>
            </div>
        </form>
    );
};

export default GuestComposer;
