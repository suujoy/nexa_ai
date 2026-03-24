const AttachmentPreviewList = ({ files = [], onRemove }) => {
    if (!files.length) return null;

    return (
        <div className="mb-3 flex max-w-full flex-wrap gap-2 overflow-hidden">
            {files.map((file, index) => (
                <span
                    key={`${file.name}-${file.size}-${index}`}
                    className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                >
                    <span className="max-w-[180px] truncate sm:max-w-[280px]">
                        {file.name}
                    </span>
                    <button
                        type="button"
                        onClick={() => onRemove?.(index)}
                        className="text-slate-400 transition hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-300"
                        aria-label={`Remove ${file.name}`}
                    >
                        x
                    </button>
                </span>
            ))}
        </div>
    );
};

export default AttachmentPreviewList;
