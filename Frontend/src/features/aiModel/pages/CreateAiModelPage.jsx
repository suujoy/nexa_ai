import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../../../components/Navbar";
import AiModelForm from "../components/AiModelForm";
import useAiModel from "../hooks/useAiModel";

const CreateAiModelPage = () => {
    const navigate = useNavigate();
    const { createAiModel, loading, error, clearAiModelError } = useAiModel();
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (formData) => {
        clearAiModelError();
        setSuccessMessage("");

        try {
            await createAiModel(formData);
            setSuccessMessage("AI model created successfully.");
            setTimeout(() => {
                navigate("/ai-models");
            }, 700);
        } catch {
            // state error already handled in hook
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#eef6ff_0%,#f8fbff_52%,#f2f7ff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#020617_0%,#07111f_52%,#020617_100%)]">
            <Navbar />

            <section className="px-4 pb-10 pt-5 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-[1700px]">
                    <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_24px_100px_rgba(0,0,0,0.45)] sm:p-8 lg:p-10">
                        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-300">
                                    Create AI Model
                                </p>
                                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                                    Add a new provider model
                                </h1>
                                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                                    Create a model entry that your backend can
                                    activate and use as default later.
                                </p>
                            </div>

                            <Link
                                to="/ai-models"
                                className="rounded-[1.1rem] border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                            >
                                Back to List
                            </Link>
                        </div>

                        {error ? (
                            <div className="mb-5 rounded-[1.3rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300">
                                {error}
                            </div>
                        ) : null}

                        {successMessage ? (
                            <div className="mb-5 rounded-[1.3rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                                {successMessage}
                            </div>
                        ) : null}

                        <AiModelForm
                            onSubmit={handleSubmit}
                            isSubmitting={loading}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CreateAiModelPage;
