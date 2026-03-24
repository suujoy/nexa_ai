import { Link } from "react-router";

const AiModelActions = ({
    model,
    onToggleActive,
    onSetDefault,
    isBusy = false,
}) => {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={() => onToggleActive?.(model._id)}
                disabled={isBusy}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/20"
            >
                {model.isActive ? "Disable" : "Enable"}
            </button>

            <button
                type="button"
                onClick={() => onSetDefault?.(model._id)}
                disabled={isBusy || model.isDefault}
                className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 transition hover:border-sky-300 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300 dark:hover:border-sky-400/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
                Set Default
            </button>

            <Link
                to={`/ai-models/delete/${model._id}`}
                className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-rose-700 transition hover:border-rose-300 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300 dark:hover:border-rose-400/40"
            >
                Delete
            </Link>
        </div>
    );
};

export default AiModelActions;
