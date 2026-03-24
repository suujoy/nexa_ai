const formatSize = (bytes) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getLabelFromUrl = (fileUrl, fallback = "Attachment") => {
    if (!fileUrl) return fallback;
    const withoutQuery = fileUrl.split("?")[0];
    const segment = withoutQuery.split("/").pop();
    return segment || fallback;
};

const AttachmentItem = ({
    attachment,
    onDelete,
    deleting = false,
    getDownloadUrl,
}) => {
    const label = getLabelFromUrl(attachment.fileUrl);
    const downloadUrl = getDownloadUrl?.(attachment._id);

    return (
        <div className="flex items-center justify-between gap-3 rounded-sm border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5">
            <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                    {label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {attachment.fileType || "file"} • {formatSize(attachment.size)}
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-sm border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 transition hover:border-sky-400 hover:text-sky-700 dark:border-white/15 dark:text-slate-200 dark:hover:border-sky-400/40 dark:hover:text-cyan-200"
                >
                    Download
                </a>
                <button
                    type="button"
                    onClick={() => onDelete?.(attachment._id)}
                    disabled={deleting}
                    className="rounded-sm border border-rose-200 px-2 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-rose-400/30 dark:text-rose-300 dark:hover:bg-rose-400/10"
                >
                    {deleting ? "Removing..." : "Delete"}
                </button>
            </div>
        </div>
    );
};

export default AttachmentItem;
