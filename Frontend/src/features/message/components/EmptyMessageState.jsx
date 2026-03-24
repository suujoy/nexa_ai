const EmptyMessageState = () => {
    return (
        <div className="px-4 py-10 text-center">
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
                No messages yet
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Start this chat by sending a message below. You can also attach
                files or images with the plus button.
            </p>
        </div>
    );
};

export default EmptyMessageState;
