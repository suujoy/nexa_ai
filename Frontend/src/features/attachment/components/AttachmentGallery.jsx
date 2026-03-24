import AttachmentItem from "./AttachmentItem";

const AttachmentGallery = ({
    attachments = [],
    loading = false,
    deleting = false,
    onDelete,
    getDownloadUrl,
}) => {
    if (!loading && !attachments.length) {
        return null;
    }

    return (
        <section className="rounded-sm border border-slate-200/80 bg-white/88 p-3 shadow-[0_14px_40px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 dark:shadow-none">
            <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">
                    Attachments
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {attachments.length}
                </p>
            </div>

            {loading ? (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Loading attachments...
                </p>
            ) : (
                <div className="space-y-2">
                    {attachments.map((attachment) => (
                        <AttachmentItem
                            key={attachment._id}
                            attachment={attachment}
                            onDelete={onDelete}
                            deleting={deleting}
                            getDownloadUrl={getDownloadUrl}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default AttachmentGallery;
