import { Link } from "react-router";

const AiModelEmptyState = () => {
    return (
        <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">
                No AI Models
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
                Start by creating your first model
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600 dark:text-slate-300">
                Add a provider, a model name, and set which model should be
                active in your workspace.
            </p>

            <Link
                to="/ai-models/create"
                className="mt-6 inline-flex rounded-[1.2rem] bg-[linear-gradient(135deg,#0891b2,#2563eb,#0f172a)] px-5 py-3 text-sm font-semibold tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(8,145,178,0.24)]"
            >
                CREATE MODEL
            </Link>
        </div>
    );
};

export default AiModelEmptyState;
