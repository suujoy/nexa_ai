const StreamMessageView = ({ text = "", thinking = false }) => {
    if (!text && !thinking) return null;

    return (
        <div className="flex justify-start">
            <div className="max-w-[65%] rounded-sm border border-cyan-200/70 bg-cyan-50 px-4 py-3 text-slate-900 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-50">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-75">
                    ai
                </p>
                {!text ? (
                    <div className="mt-2 inline-flex items-center gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500/80 [animation-delay:0ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500/80 [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500/80 [animation-delay:300ms]" />
                    </div>
                ) : (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7">
                        {text}
                        {thinking ? (
                            <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-cyan-500/90 align-middle" />
                        ) : null}
                    </p>
                )}
            </div>
        </div>
    );
};

export default StreamMessageView;
