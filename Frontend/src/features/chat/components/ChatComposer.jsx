import { useRef, useState } from "react";

const ChatComposer = ({ onSend, sending = false }) => {
    const [message, setMessage] = useState("");
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim() && !files.length) return;

        await onSend?.({
            message: message.trim(),
            files,
        });

        setMessage("");
        setFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-[1.6rem] border border-slate-200/80 bg-white/88 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 dark:shadow-none"
        >
            {files.length ? (
                <div className="mb-3 flex flex-wrap gap-2">
                    {files.map((file) => (
                        <span
                            key={`${file.name}-${file.size}`}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                        >
                            {file.name}
                        </span>
                    ))}
                </div>
            ) : null}

            <div className="flex items-end gap-3">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    aria-label="Attach files"
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

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                />

                <textarea
                    rows="1"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="min-h-[46px] flex-1 resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-sky-400/40 dark:focus:ring-sky-400/10"
                />

                <button
                    type="submit"
                    disabled={sending}
                    className="rounded-xl bg-[linear-gradient(135deg,#0891b2,#2563eb,#0f172a)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(8,145,178,0.22)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {sending ? "Sending..." : "Send"}
                </button>
            </div>
        </form>
    );
};

export default ChatComposer;
