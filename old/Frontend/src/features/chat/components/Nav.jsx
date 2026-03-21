import { useSelector } from "react-redux";
import { FaSignOutAlt } from "react-icons/fa";
import ThemeToggle from "../../theme/ThemeToggle";

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        console.log("Logout clicked");
    };

    return (
        <nav
            className="w-full border-b border-slate-200/80 bg-white/80 px-6 py-4 text-slate-900 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100"
        >
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-emerald-500 dark:text-emerald-400">
                        NexaAi
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Conversations workspace
                    </p>
                </div>

                <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-slate-100/80 px-3 py-2 sm:flex dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500 font-bold text-slate-950">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="leading-tight">
                        <p className="text-sm font-medium">
                            {user?.name || "User"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Active now
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <ThemeToggle />
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-xl bg-pink-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-pink-400"
                >
                    <FaSignOutAlt />
                    Logout
                </button>
            </div>
            </div>
        </nav>
    );
};

export default Navbar;
