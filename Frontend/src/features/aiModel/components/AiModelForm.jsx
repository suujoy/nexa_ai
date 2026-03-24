import { useState } from "react";

const AiModelForm = ({ onSubmit, isSubmitting = false }) => {
    const [form, setForm] = useState({
        name: "",
        provider: "",
        model: "",
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Model Name
                    </label>
                    <input
                        name="name"
                        type="text"
                        placeholder='Example: "Groq Llama 3.3 70B"'
                        value={form.name}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-sky-400/40 dark:focus:ring-sky-400/10"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Provider
                    </label>
                    <input
                        name="provider"
                        type="text"
                        placeholder='Example: "groq"'
                        value={form.provider}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-sky-400/40 dark:focus:ring-sky-400/10"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Model Slug
                </label>
                <input
                    name="model"
                    type="text"
                    placeholder='Example: "llama-3.3-70b-versatile"'
                    value={form.model}
                    onChange={handleChange}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-sky-400/40 dark:focus:ring-sky-400/10"
                />
            </div>

            <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                Keep the display name readable and the model slug exactly the
                same as your provider expects.
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-[1.3rem] bg-[linear-gradient(135deg,#0891b2,#2563eb,#0f172a)] px-5 py-3.5 text-sm font-semibold tracking-[0.18em] text-white shadow-[0_18px_40px_rgba(8,145,178,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {isSubmitting ? "SAVING..." : "CREATE MODEL"}
            </button>
        </form>
    );
};

export default AiModelForm;
