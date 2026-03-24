import { useMemo, useState } from "react";
import useAiModel from "../../aiModel/hooks/useAiModel";

const ChangeChatModel = ({ chat, onChangeModel, disabled = false }) => {
    const { activeAiModels } = useAiModel();
    const [isOpen, setIsOpen] = useState(false);

    const availableModels = useMemo(() => activeAiModels || [], [activeAiModels]);

    return (
        <div className="relative z-20">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                disabled={disabled}
                aria-label="Change model"
                title="Change model"
                className="inline-flex h-10 w-full items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 lg:w-10"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {isOpen ? (
                <div className="absolute left-0 top-[calc(100%+0.55rem)] z-30 w-[min(250px,calc(100vw-2.5rem))] rounded-sm border border-slate-200 bg-white p-2 shadow-[0_18px_50px_rgba(15,23,42,0.16)] lg:left-auto lg:right-0 lg:w-[250px] dark:border-white/10 dark:bg-slate-950">
                    <div className="grid max-h-[min(320px,calc(100svh-180px))] gap-1 overflow-y-auto pr-1">
                        {availableModels.length ? (
                            availableModels.map((model) => (
                                <button
                                    key={model._id}
                                    type="button"
                                    onClick={() => {
                                        onChangeModel?.(model._id);
                                        setIsOpen(false);
                                    }}
                                    className={`rounded-sm border px-3 py-2 text-left transition ${
                                        chat?.model?._id === model._id
                                            ? "border-sky-300 bg-sky-50 dark:border-sky-400/40 dark:bg-sky-400/10"
                                            : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"
                                    }`}
                                >
                                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                        {model.name}
                                        <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
                                            ({model.provider})
                                        </span>
                                    </p>
                                </button>
                            ))
                        ) : (
                            <div className="rounded-sm border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                                No active AI models found.
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default ChangeChatModel;
