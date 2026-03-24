const ChatSidebarSection = ({ title, count, children }) => {
    return (
        <section className="space-y-0">
            <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">
                    {title}
                </p>
                <span className="rounded-sm bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-300">
                    {count}
                </span>
            </div>
            {children}
        </section>
    );
};

export default ChatSidebarSection;
