const GuestStatusCard = ({
    status,
    chatTitle,
}) => {
    return (
        <section className="rounded-sm border border-slate-200/80 bg-white/88 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 dark:shadow-none">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Chat Status
            </p>
            <h3 className="mt-2 truncate text-base font-semibold text-slate-900 dark:text-white">
                {chatTitle || "Guest Chat"}
            </h3>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-sm border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        Used
                    </p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                        {status?.messageCount ?? 0}
                    </p>
                </div>
                <div className="rounded-sm border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        Limit
                    </p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                        {status?.messageLimit ?? 0}
                    </p>
                </div>
                <div className="rounded-sm border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        Left
                    </p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                        {status?.remainingMessages ?? 0}
                    </p>
                </div>
            </div>

        </section>
    );
};

export default GuestStatusCard;
