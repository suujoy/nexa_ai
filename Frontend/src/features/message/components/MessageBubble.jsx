import ReactMarkdown from "react-markdown";

const MessageBubble = ({ message }) => {
    const isUser = message.role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[65%] rounded-sm px-4 py-3 ${
                    isUser
                        ? "bg-[linear-gradient(135deg,#0891b2,#2563eb,#0f172a)] text-white"
                        : "border border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                }`}
            >
                {isUser ? (
                    <p className="whitespace-pre-wrap text-sm leading-7">
                        {message.content}
                    </p>
                ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none leading-7">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;
