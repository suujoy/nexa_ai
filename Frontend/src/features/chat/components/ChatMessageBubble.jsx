const ChatMessageBubble = ({ message }) => {
    const isUser = message.role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    isUser
                        ? "bg-[linear-gradient(135deg,#0891b2,#2563eb,#0f172a)] text-white"
                        : "border border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                }`}
            >
                <p className="text-[11px] m-2 font-semibold uppercase tracking-[0.18em] opacity-75">
                    {message.role}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7">
                    {message.content}
                </p>
            </div>
        </div>
    );
};

export default ChatMessageBubble;
