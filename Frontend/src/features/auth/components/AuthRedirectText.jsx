import { Link } from "react-router";

const AuthRedirectText = ({ text, linkText, to }) => {
    return (
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
            {text}{" "}
            <Link
                to={to}
                className="font-semibold text-cyan-700 transition hover:text-slate-950 dark:text-cyan-300 dark:hover:text-white"
            >
                {linkText}
            </Link>
        </p>
    );
};

export default AuthRedirectText;
