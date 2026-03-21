import { useState, useRef, useEffect } from "react";
import {
    FaPlus,
    FaTimes,
    FaPaperPlane,
    FaImage,
    FaMicrophone,
    FaFileAlt,
    FaCode,
} from "react-icons/fa";

const featureButtons = [
    { icon: <FaImage size={15} />, label: "Image", key: "image" },
    { icon: <FaMicrophone size={15} />, label: "Voice", key: "voice" },
    { icon: <FaFileAlt size={15} />, label: "File", key: "file" },
    { icon: <FaCode size={15} />, label: "Code", key: "code" },
];

const MessageBox = ({ onSend, disabled = false }) => {
    const [input, setInput] = useState("");
    const [open, setOpen] = useState(false);
    const popupRef = useRef(null);
    const textareaRef = useRef(null);

    const handleSend = () => {
        if (!input.trim() || disabled) return;
        onSend?.(input.trim());
        setInput("");
        setOpen(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFeatureClick = (key) => {
        // placeholder — wire up each feature when ready
        console.log("Feature clicked:", key);
        setOpen(false);
    };

    // Close popup when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Auto-grow textarea
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }, [input]);

    return (
        <div className="w-full px-4 pb-4 pt-2">
            <div className="mx-auto max-w-3xl">
                <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-md backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
                    {/* Plus button + feature popup */}
                    <div
                        className="relative flex-shrink-0 self-end mb-1"
                        ref={popupRef}
                    >
                        <button
                            onClick={() => setOpen((prev) => !prev)}
                            className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                                open
                                    ? "bg-pink-500 text-white"
                                    : "bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-400"
                            }`}
                        >
                            {open ? (
                                <FaTimes size={13} />
                            ) : (
                                <FaPlus size={13} />
                            )}
                        </button>

                        {/* Feature popup */}
                        {open && (
                            <div className="absolute bottom-12 left-0 z-50 flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
                                {featureButtons.map((btn) => (
                                    <button
                                        key={btn.key}
                                        onClick={() =>
                                            handleFeatureClick(btn.key)
                                        }
                                        className="flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
                                    >
                                        <span className="text-emerald-500">
                                            {btn.icon}
                                        </span>
                                        {btn.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message NexaAI..."
                        disabled={disabled}
                        className="flex-1 resize-none bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />

                    {/* Send button */}
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || disabled}
                        className="mb-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <FaPaperPlane size={13} />
                    </button>
                </div>

                <p className="mt-1 text-center text-xs text-slate-400 dark:text-slate-600">
                    Enter to send · Shift+Enter for new line
                </p>
            </div>
        </div>
    );
};

export default MessageBox;
