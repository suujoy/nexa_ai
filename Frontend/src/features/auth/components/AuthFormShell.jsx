const AuthFormShell = ({ eyebrow, title, description, sideNote, children }) => {
    return (
        <section className="px-4 pb-10 pt-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1700px]">
                <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_24px_100px_rgba(0,0,0,0.45)] sm:p-8 lg:p-10">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-300">
                                {eyebrow}
                            </p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                                {title}
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                                {description}
                            </p>
                        </div>

                        {sideNote ? (
                            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                                {sideNote}
                            </div>
                        ) : null}
                    </div>

                    {children}
                </div>
            </div>
        </section>
    );
};

export default AuthFormShell;
