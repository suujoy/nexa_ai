import { useEffect, useRef, useState } from "react";
import AttachmentPickerButton from "./AttachmentPickerButton";
import AttachmentPreviewList from "./AttachmentPreviewList";

const MAX_TEXTAREA_LINES = 10;
const FEATURE_OPTIONS = [
    { id: "choose-file", label: "Choose File", description: "Attach files to this chat", soon: false },
    { id: "image-generate", label: "AI Image Create", description: "Generate images from prompts", soon: true },
    { id: "web-search", label: "Web Search", description: "Ask with live web context", soon: true },
    { id: "voice-input", label: "Voice Input", description: "Dictate using your microphone", soon: true },
];

const MessageComposer = ({ onSend, sending = false }) => {
    const [message, setMessage] = useState("");
    const [files, setFiles] = useState([]);
    const [featureMenuOpen, setFeatureMenuOpen] = useState(false);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const featureMenuRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ((!message.trim() && !files.length) || sending) return;

        const payload = {
            message: message.trim(),
            files,
        };

        setMessage("");
        setFiles([]);
        setFeatureMenuOpen(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        try {
            await onSend?.(payload);
        } catch {
            setMessage(payload.message);
            setFiles(payload.files);
        } finally {
            window.requestAnimationFrame(() => {
                textareaRef.current?.focus();
            });
        }
    };

    const handleTextareaKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if ((!message.trim() && !files.length) || sending) return;
            handleSubmit(e);
        }
    };

    useEffect(() => {
        if (!textareaRef.current) return;

        const textarea = textareaRef.current;
        textarea.style.height = "auto";

        const computedStyles = window.getComputedStyle(textarea);
        const lineHeight = parseFloat(computedStyles.lineHeight) || 22;
        const paddingTop = parseFloat(computedStyles.paddingTop) || 0;
        const paddingBottom = parseFloat(computedStyles.paddingBottom) || 0;
        const borderTop = parseFloat(computedStyles.borderTopWidth) || 0;
        const borderBottom = parseFloat(computedStyles.borderBottomWidth) || 0;
        const maxHeight =
            lineHeight * MAX_TEXTAREA_LINES +
            paddingTop +
            paddingBottom +
            borderTop +
            borderBottom;

        const nextHeight = Math.min(textarea.scrollHeight, maxHeight);
        textarea.style.height = `${nextHeight}px`;
        textarea.style.overflowY =
            textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [message]);

    useEffect(() => {
        const closeMenuOnOutsideClick = (event) => {
            if (!featureMenuRef.current?.contains(event.target)) {
                setFeatureMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", closeMenuOnOutsideClick);
        return () => {
            document.removeEventListener("mousedown", closeMenuOnOutsideClick);
        };
    }, []);

    const handleFeatureSelect = (featureId) => {
        if (featureId === "choose-file") {
            fileInputRef.current?.click();
            setFeatureMenuOpen(false);
            return;
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-md border border-slate-200/80 bg-white/88 p-3 shadow-[0_14px_40px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:p-4"
        >
            <AttachmentPreviewList
                files={files}
                onRemove={(index) =>
                    setFiles((current) => current.filter((_, i) => i !== index))
                }
            />

            <div className="flex items-end gap-2 sm:gap-3">
                <textarea
                    ref={textareaRef}
                    rows="1"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleTextareaKeyDown}
                    placeholder="Type your message here..."
                    className="min-h-[46px] min-w-0 flex-1 resize-none overflow-y-hidden rounded-sm border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-sky-400/40 dark:focus:ring-sky-400/10 sm:px-4"
                />

                <div className="flex shrink-0 items-center gap-2">
                    <div className="relative" ref={featureMenuRef}>
                        <AttachmentPickerButton
                            onClick={() =>
                                setFeatureMenuOpen((current) => !current)
                            }
                            expanded={featureMenuOpen}
                            disabled={sending}
                        />
                        {featureMenuOpen ? (
                            <div className="absolute bottom-[calc(100%+10px)] right-0 z-30 w-[min(280px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-md border border-slate-200 bg-white p-2 shadow-[0_16px_45px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-slate-950">
                                <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                                    Features
                                </p>
                                <div className="mt-1 space-y-1">
                                    {FEATURE_OPTIONS.map((feature) => (
                                        <button
                                            key={feature.id}
                                            type="button"
                                            onClick={() =>
                                                handleFeatureSelect(feature.id)
                                            }
                                            disabled={feature.soon}
                                            className="flex w-full items-center justify-between gap-2 rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:border-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-white/5 dark:hover:border-sky-400/40 dark:hover:bg-sky-400/10"
                                        >
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                    {feature.label}
                                                </p>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    {feature.description}
                                                </p>
                                            </div>
                                            {feature.soon ? (
                                                <span className="rounded-full border border-cyan-400/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-300">
                                                    Soon
                                                </span>
                                            ) : null}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(event) =>
                            setFiles((current) => [
                                ...current,
                                ...Array.from(event.target.files || []),
                            ])
                        }
                    />
                    <button
                        type="submit"
                        disabled={sending}
                        className="rounded-sm bg-[linear-gradient(135deg,#0891b2,#2563eb,#0f172a)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[0_14px_30px_rgba(8,145,178,0.22)] disabled:cursor-not-allowed disabled:opacity-70 sm:px-5 sm:tracking-[0.18em]"
                    >
                        {sending ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default MessageComposer;
