import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Navbar from "../../../components/Navbar";
import useAiModel from "../hooks/useAiModel";

const DeleteAiModelPage = () => {
    const { modelId } = useParams();
    const navigate = useNavigate();
    const {
        selectedAiModel,
        loading,
        error,
        fetchAiModelDetails,
        deleteAiModel,
    } = useAiModel();

    useEffect(() => {
        if (modelId) {
            fetchAiModelDetails(modelId).catch(() => {});
        }
    }, [modelId]);

    const handleDelete = async () => {
        try {
            await deleteAiModel(modelId);
            navigate("/ai-models");
        } catch {
            // handled in hook state
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.1),transparent_22%),linear-gradient(180deg,#eef6ff_0%,#f8fbff_52%,#f2f7ff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.12),transparent_22%),linear-gradient(180deg,#020617_0%,#07111f_52%,#020617_100%)]">
            <Navbar />

            <section className="px-4 pb-10 pt-5 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-[1700px]">
                    <div className="mx-auto max-w-2xl rounded-[2rem] border border-rose-200/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-rose-400/20 dark:bg-slate-950/70 dark:shadow-[0_24px_100px_rgba(0,0,0,0.45)] sm:p-8 lg:p-10">
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rose-600 dark:text-rose-300">
                            Delete AI Model
                        </p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                            Remove this model permanently
                        </h1>
                        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            This action cannot be undone. Make sure this model is
                            no longer needed before deleting it.
                        </p>

                        {error ? (
                            <div className="mt-5 rounded-[1.3rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300">
                                {error}
                            </div>
                        ) : null}

                        <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
                            {selectedAiModel ? (
                                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                    <p>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            Name:
                                        </span>{" "}
                                        {selectedAiModel.name}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            Provider:
                                        </span>{" "}
                                        {selectedAiModel.provider}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            Model:
                                        </span>{" "}
                                        <span className="font-mono">
                                            {selectedAiModel.model}
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    {loading
                                        ? "Loading model details..."
                                        : "Model details not available."}
                                </p>
                            )}
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={loading || !selectedAiModel}
                                className="rounded-[1.2rem] bg-[linear-gradient(135deg,#e11d48,#be123c,#4c0519)] px-5 py-3 text-sm font-semibold tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(225,29,72,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? "DELETING..." : "DELETE MODEL"}
                            </button>

                            <Link
                                to="/ai-models"
                                className="rounded-[1.2rem] border border-slate-200 bg-white px-5 py-3 text-sm font-semibold tracking-[0.16em] text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                            >
                                CANCEL
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DeleteAiModelPage;
