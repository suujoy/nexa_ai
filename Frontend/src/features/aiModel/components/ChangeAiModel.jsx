import { useEffect, useMemo, useState } from "react";
import useAiModel from "../hooks/useAiModel";

const fallbackModels = [
    {
        id: "groq",
        name: "Groq",
        provider: "groq",
        model: "llama-3.3-70b-versatile",
    },
    {
        id: "gemini",
        name: "Gemini",
        provider: "google",
        model: "gemini-1.5-flash",
    },
    {
        id: "mistral",
        name: "Mistral",
        provider: "mistral",
        model: "mistral-large-latest",
    },
];

const getModelId = (model) => model?._id || model?.id || model?.name;

const ChangeAiModel = ({ models = [] }) => {
    const {
        activeAiModels,
        defaultAiModel,
        selectedAiModel,
        fetchActiveAiModels,
        fetchDefaultAiModel,
        setSelectedAiModel,
    } = useAiModel();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchActiveAiModels().catch(() => {});
        fetchDefaultAiModel().catch(() => {});
    }, []);

    const availableModels = useMemo(() => {
        if (activeAiModels?.length) return activeAiModels;
        if (models?.length) return models;
        return fallbackModels;
    }, [activeAiModels, models]);

    useEffect(() => {
        if (!selectedAiModel && defaultAiModel) {
            setSelectedAiModel(defaultAiModel);
            return;
        }

        if (!selectedAiModel && availableModels.length) {
            setSelectedAiModel(availableModels[0]);
        }
    }, [defaultAiModel, availableModels, selectedAiModel, setSelectedAiModel]);

    const activeModel = selectedAiModel || availableModels[0];

    return (
        <div className="relative z-[130] w-[120px] sm:w-[170px] md:w-[190px]">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 text-left shadow-[0_6px_16px_rgba(15,23,42,0.06)] transition hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
            >
                <p className="truncate text-[13px] font-semibold text-slate-900 dark:text-white">
                    {activeModel?.name || "Model"}
                </p>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className={`h-4 w-4 shrink-0 text-slate-500 transition dark:text-slate-400 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m6 9 6 6 6-6"
                    />
                </svg>
            </button>

            {isOpen ? (
                <div className="absolute left-0 top-[calc(100%+0.45rem)] z-[999] w-[min(220px,calc(100vw-1.5rem))] rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.18)] sm:left-auto sm:right-0 sm:w-[220px] dark:border-white/10 dark:bg-slate-950">
                    <div className="grid gap-1">
                        {availableModels.map((model) => {
                            const isActive =
                                getModelId(model) === getModelId(activeModel);

                            return (
                                <button
                                    key={getModelId(model)}
                                    type="button"
                                    onClick={() => {
                                        setSelectedAiModel(model);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full rounded-lg px-3 py-2 text-left transition ${
                                        isActive
                                            ? "bg-slate-100 text-slate-950 dark:bg-white/10 dark:text-white"
                                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                                    }`}
                                >
                                    <p className="truncate text-sm font-medium">
                                        {model.name}
                                        <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
                                            ({model.provider})
                                        </span>
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default ChangeAiModel;
