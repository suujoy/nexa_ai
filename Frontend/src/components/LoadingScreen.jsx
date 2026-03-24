const LoadingScreen = ({ label = "Checking response..." }) => {
    return (
        <div className="flex h-[100dvh] w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#eef6ff_0%,#f8fbff_52%,#f2f7ff_100%)] px-6 dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#020617_0%,#07111f_52%,#020617_100%)]">
            <div className="flex min-w-[260px] items-center gap-3 rounded-md border border-slate-200/80 bg-white/85 px-5 py-4 text-slate-800 shadow-[0_18px_50px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-100">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-500/40 border-t-cyan-500" />
                <p className="text-sm font-semibold tracking-[0.06em]">{label}</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
