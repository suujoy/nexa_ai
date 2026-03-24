import { useEffect, useRef } from "react";
import EmptyMessageState from "./EmptyMessageState";
import MessageBubble from "./MessageBubble";
import StreamMessageView from "./StreamMessageView";

const MessageList = ({
    className = "",
    messages = [],
    loading = false,
    streamedText = "",
    isAiThinking = false,
}) => {
    const listRef = useRef(null);

    useEffect(() => {
        const container = listRef.current;
        if (!container) return;
        container.scrollTop = container.scrollHeight;
    }, [messages, streamedText, isAiThinking]);

    return (
        <div
            className={`flex min-h-0 flex-col rounded-md border border-slate-200/80 bg-white/88  shadow-[0_14px_40px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 dark:shadow-none ${className}`}
        >
            {/* <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Messages
            </p> */}

            <div
                ref={listRef}
                className="custom-scrollbar flex-1 min-h-0 space-y-4 overflow-y-auto rounded-sm border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
            >
                {loading ? (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Loading messages...
                    </p>
                ) : messages.length || streamedText || isAiThinking ? (
                    <>
                        {messages.map((message) => (
                            <MessageBubble key={message._id} message={message} />
                        ))}
                        <StreamMessageView
                            text={streamedText}
                            thinking={isAiThinking}
                        />
                    </>
                ) : (
                    <EmptyMessageState />
                )}
            </div>
        </div>
    );
};

export default MessageList;
