import { useSelector, useDispatch } from "react-redux";
import { FaSignOutAlt, FaBars } from "react-icons/fa";
import ThemeToggle from "../../theme/ThemeToggle";
import { setModel } from "../../AiModels/aiModel.slice";
import { useAuth } from "../../auth/hooks/useAuth";

const Navbar = ({ onMenuClick }) => {
    const dispatch = useDispatch();
    const { handleLogout } = useAuth();

    const { user } = useSelector((state) => state.auth);
    const selectedModel = useSelector((state) => state.model.selectedModel);

    return (
        <nav className="w-full border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 py-3 sm:py-4 text-slate-900 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100">
            <div className="mx-auto flex w-full max-w-[1700px] items-center justify-between gap-3">
                {/* LEFT */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 rounded-md bg-slate-200 dark:bg-slate-800"
                    >
                        <FaBars size={14} />
                    </button>

                    <div>
                        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-emerald-500 dark:text-emerald-400">
                            NexaAi
                        </h1>
                        <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
                            Conversations workspace
                        </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-3 rounded-full border border-slate-200 bg-slate-100/80 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
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

                {/* RIGHT */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <select
                        value={selectedModel}
                        onChange={(e) => dispatch(setModel(e.target.value))}
                        className="rounded-lg px-2 py-1 text-sm bg-slate-200 dark:bg-slate-800 dark:text-slate-100 outline-none cursor-pointer"
                    >
                        <option value="groq">Groq</option>
                        <option value="gemini">Gemini</option>
                        <option value="mistral">Mistral</option>
                    </select>

                    <ThemeToggle />

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-xl bg-pink-500 px-2 sm:px-4 py-2 text-sm sm:text-base font-medium text-slate-950 transition hover:bg-pink-400"
                    >
                        <FaSignOutAlt />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
