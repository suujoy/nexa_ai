import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "./theme.slice";

const ThemeToggle = ({ className = "" }) => {
    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.theme.darkMode);

    return (
        <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            className={`inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/80 px-2 sm:px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-900 ${className}`}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
        >
            {darkMode ? (
                <FaSun className="text-amber-400" />
            ) : (
                <FaMoon className="text-slate-600" />
            )}

            {/* TEXT hidden on mobile */}
            <span className="hidden sm:inline">
                {darkMode ? "Light mode" : "Dark mode"}
            </span>
        </button>
    );
};

export default ThemeToggle;