const AuthErrorAlert = ({ message }) => {
    if (!message) return null;

    return (
        <div className="mb-5 rounded-[1.3rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300">
            {message}
        </div>
    );
};

export default AuthErrorAlert;
