import AiModelActions from "./AiModelActions";
import AiModelBadge from "./AiModelBadge";

const AiModelCard = ({
    model,
    onToggleActive,
    onSetDefault,
    isBusy = false,
}) => {
    return (
        <article className="rounded-[1.5rem] border border-slate-200/80 bg-white/88 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 dark:shadow-none">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap gap-2">
                        <AiModelBadge tone="provider">
                            {model.provider}
                        </AiModelBadge>
                        <AiModelBadge tone={model.isActive ? "active" : "inactive"}>
                            {model.isActive ? "Active" : "Inactive"}
                        </AiModelBadge>
                        {model.isDefault ? (
                            <AiModelBadge tone="default">Default</AiModelBadge>
                        ) : null}
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
                            {model.name}
                        </h3>
                        <p className="mt-2 font-mono text-sm text-slate-600 dark:text-slate-300">
                            {model.model}
                        </p>
                    </div>

                    <div className="grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2 lg:grid-cols-3">
                        <p>
                            <span className="font-semibold text-slate-900 dark:text-white">
                                Max Token:
                            </span>{" "}
                            {model.maxToken || 0}
                        </p>
                        <p>
                            <span className="font-semibold text-slate-900 dark:text-white">
                                Cost/Token:
                            </span>{" "}
                            {model.costPerToken || 0}
                        </p>
                        <p>
                            <span className="font-semibold text-slate-900 dark:text-white">
                                ID:
                            </span>{" "}
                            <span className="font-mono text-[12px]">
                                {model._id}
                            </span>
                        </p>
                    </div>
                </div>

                <AiModelActions
                    model={model}
                    onToggleActive={onToggleActive}
                    onSetDefault={onSetDefault}
                    isBusy={isBusy}
                />
            </div>
        </article>
    );
};

export default AiModelCard;
