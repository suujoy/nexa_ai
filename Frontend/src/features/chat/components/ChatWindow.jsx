import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaRobot, FaArrowDown } from "react-icons/fa";

const ChatWindow = () => {
    const messages = useSelector((state) => state.chat.messages);
    const currentChat = useSelector((state) => state.chat.currentChat);
    const user = useSelector((state) => state.auth.user);

    const bottomRef = useRef(null);
    const containerRef = useRef(null);

    const [showScroll, setShowScroll] = useState(false);

    // Detect scroll position
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleScroll = () => {
            const isBottom =
                el.scrollHeight - el.scrollTop - el.clientHeight < 50;

            setShowScroll(!isBottom);
        };

        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, []);

    // Auto scroll on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const scrollToBottom = () => {
        containerRef.current?.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: "smooth",
        });
    };

    if (!currentChat) {
        return (
            <div className="flex h-full items-center justify-center px-4">
                <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-600 text-center">
                    Select a chat or start typing to begin
                </p>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex h-full items-center justify-center px-4">
                <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-600 text-center">
                    No messages yet. Say something!
                </p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="h-full overflow-y-auto px-4 py-6 flex flex-col gap-4 relative"
        >
            {messages.map((msg) =>
                msg.role === "user" ? (
                    <UserMessage key={msg._id} msg={msg} user={user} />
                ) : (
                    <AiMessage key={msg._id} msg={msg} />
                ),
            )}

            <div ref={bottomRef} />

            {/* Scroll Button */}
            {showScroll && (
                <button
                    onClick={scrollToBottom}
                    className="absolute bottom-20 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-400 transition"
                >
                    <FaArrowDown size={14} />
                </button>
            )}
        </div>
    );
};

const UserMessage = ({ msg, user }) => (
    <div className="flex items-end justify-end gap-1 sm:gap-2">
        <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl rounded-br-sm bg-emerald-500 px-3 sm:px-4 py-2 text-xs sm:text-sm text-white shadow-sm">
            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            <p className="mt-1 text-right text-[9px] sm:text-[10px] text-emerald-100/70">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </p>
        </div>

        <div className="flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full bg-pink-500 text-[10px] sm:text-sm font-bold text-white shadow-sm">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
    </div>
);

const AiMessage = ({ msg }) => (
    <div className="flex items-end gap-1 sm:gap-2">
        <div className="flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-emerald-600 shadow-sm dark:bg-slate-700 dark:text-emerald-400">
            <FaRobot size={12} />
        </div>

        <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white/80 px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-800 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100">
            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            <p className="mt-1 text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </p>
        </div>
    </div>
);

export default ChatWindow;
