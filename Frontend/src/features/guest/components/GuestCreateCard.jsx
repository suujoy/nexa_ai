import { useState } from "react";

const GuestCreateCard = ({ loading = false, onCreate }) => {
    const [name, setName] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        await onCreate?.(name);
    };

    return (
        <section className="rounded-sm border border-slate-200/80 bg-white/88 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 dark:shadow-none">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Guest Session
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                Start a temporary chat
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                This session does not require login and has a message limit.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Name (optional)"
                    className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-sky-400/40 dark:focus:ring-sky-400/10"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-sm bg-[linear-gradient(135deg,#0891b2,#2563eb,#0f172a)] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? "Creating..." : "Start Guest Chat"}
                </button>
            </form>
        </section>
    );
};

export default GuestCreateCard;
