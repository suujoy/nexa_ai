import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FaRobot } from "react-icons/fa";

const ChatWindow = () => {
    const messages = useSelector((state) => state.chat.messages);
    const currentChat = useSelector((state) => state.chat.currentChat);
    const user = useSelector((state) => state.auth.user);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!currentChat) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-sm text-slate-400 dark:text-slate-600">
                    Select a chat or start typing to begin
                </p>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-sm text-slate-400 dark:text-slate-600">
                    No messages yet. Say something!
                </p>
            </div>
        );
    }

    return (
        // h-full fills the parent, overflow-y-auto enables scroll inside it
        <div className="h-full overflow-y-auto px-4 py-6 flex flex-col gap-4">
            {messages.map((msg) =>
                msg.role === "user" ? (
                    <UserMessage key={msg._id} msg={msg} user={user} />
                ) : (
                    <AiMessage key={msg._id} msg={msg} />
                ),
            )}
            <div ref={bottomRef} />
        </div>
    );
};

const UserMessage = ({ msg, user }) => (
    <div className="flex items-end justify-end gap-2">
        <div className="max-w-[70%] rounded-2xl rounded-br-sm bg-emerald-500 px-4 py-2.5 text-sm text-white shadow-sm">
            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            <p className="mt-1 text-right text-[10px] text-emerald-100/70">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </p>
        </div>
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-pink-500 text-sm font-bold text-white shadow-sm">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
    </div>
);

const AiMessage = ({ msg }) => (
    <div className="flex items-end gap-2">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-emerald-600 shadow-sm dark:bg-slate-700 dark:text-emerald-400">
            <FaRobot size={14} />
        </div>
        <div className="max-w-[70%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-800 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100">
            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </p>
        </div>
    </div>
);

export default ChatWindow;
