import ChatMessageBubble from "./ChatMessageBubble";

const ChatMessages = ({ messages = [], loading = false }) => {
    return (
        <div className="rounded-[1.6rem] border border-slate-200/80 bg-white/88 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 dark:shadow-none">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Messages
            </p>

            <div className="mt-5 min-h-[320px] space-y-3 rounded-[1.3rem] border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                {loading ? (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Loading messages...
                    </p>
                ) : messages.length ? (
                    messages.map((message) => (
                        <ChatMessageBubble key={message._id} message={message} />
                    ))
                ) : (
                    <div className="px-4 py-10 text-center">
                        <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
                            No messages yet
                        </h3>
                        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                            Start this chat by sending a message below. You can
                            also attach files or images with the plus button.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessages;
