import { useEffect } from "react";
import { Link } from "react-router";
import Navbar from "../../../components/Navbar";
import AiModelList from "../components/AiModelList";
import useAiModel from "../hooks/useAiModel";

const AiModelListPage = () => {
    const {
        aiModels,
        loading,
        error,
        fetchAiModels,
        updateActiveAiModel,
        updateDefaultAiModel,
        clearAiModelError,
    } = useAiModel();

    useEffect(() => {
        fetchAiModels().catch(() => {});
    }, []);

    const handleToggleActive = async (modelId) => {
        await updateActiveAiModel(modelId);
        await fetchAiModels();
    };

    const handleSetDefault = async (modelId) => {
        await updateDefaultAiModel(modelId);
        await fetchAiModels();
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#eef6ff_0%,#f8fbff_52%,#f2f7ff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#020617_0%,#07111f_52%,#020617_100%)]">
            <Navbar />

            <section className="px-4 pb-10 pt-5 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-[1700px] space-y-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-300">
                                AI Models
                            </p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                                Model control center
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                                Manage providers, switch defaults, and control
                                which models are active for the app.
                            </p>
                        </div>

                        <Link
                            to="/ai-models/create"
                            className="inline-flex rounded-[1.2rem] bg-[linear-gradient(135deg,#0891b2,#2563eb,#0f172a)] px-5 py-3 text-sm font-semibold tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(8,145,178,0.24)]"
                        >
                            CREATE MODEL
                        </Link>
                    </div>

                    {error ? (
                        <div className="flex flex-col gap-3 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-4 dark:border-rose-400/20 dark:bg-rose-400/10">
                            <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                                {error}
                            </p>
                            <button
                                type="button"
                                onClick={clearAiModelError}
                                className="self-start rounded-xl border border-rose-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-rose-700 dark:border-rose-400/20 dark:text-rose-300"
                            >
                                Dismiss
                            </button>
                        </div>
                    ) : null}

                    {loading && !aiModels.length ? (
                        <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 px-5 py-8 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                            Loading AI models...
                        </div>
                    ) : (
                        <AiModelList
                            aiModels={aiModels}
                            onToggleActive={handleToggleActive}
                            onSetDefault={handleSetDefault}
                            isBusy={loading}
                        />
                    )}
                </div>
            </section>
        </div>
    );
};

export default AiModelListPage;
