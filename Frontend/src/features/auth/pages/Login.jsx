import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../../../components/Navbar";
import AuthErrorAlert from "../components/AuthErrorAlert";
import AuthFormShell from "../components/AuthFormShell";
import AuthRedirectText from "../components/AuthRedirectText";
import FormGroup from "../components/FormGroup";
import PasswordField from "../components/PasswordField";
import useAuth from "../hooks/useAuth";

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        identifier: "",
        password: "",
    });
    const { login, loading, error, clearAuthError } = useAuth();

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearAuthError();

        try {
            await login(form);
            navigate("/chat");
        } catch {
            // handled in auth state
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#eef6ff_0%,#f8fbff_52%,#f2f7ff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_24%),linear-gradient(180deg,#020617_0%,#07111f_52%,#020617_100%)]">
            <Navbar />

            <AuthFormShell
                eyebrow="Login"
                title="Enter your workspace"
                description="Sign in with your username or email and move directly into your authenticated flow."
                sideNote="Use your username or email as identifier"
            >
                <AuthErrorAlert message={error} />

                <form onSubmit={handleSubmit} className="space-y-5">
                    <FormGroup
                        label="Identifier"
                        type="text"
                        placeholder="Enter username or email"
                        value={form.identifier}
                        onChange={handleChange}
                        name="identifier"
                    />

                    <PasswordField
                        label="Password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        name="password"
                    />

                    <div className="flex items-center justify-between rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-white/5">
                        <span className="text-slate-600 dark:text-slate-300">
                            Forgot your password?
                        </span>
                        <Link
                            to="/forgot-password"
                            className="font-semibold text-cyan-700 transition hover:text-slate-950 dark:text-cyan-300 dark:hover:text-white"
                        >
                            Reset
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-[1.4rem] bg-[linear-gradient(135deg,#0891b2,#2563eb,#0f172a)] px-5 py-3.5 text-sm font-semibold tracking-[0.18em] text-white shadow-[0_20px_40px_rgba(8,145,178,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_55px_rgba(37,99,235,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? "SIGNING IN..." : "SIGN IN"}
                    </button>
                </form>

                <AuthRedirectText
                    text="Need a new account?"
                    linkText="Create one"
                    to="/register"
                />
                <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-300">
                    Want to try first?{" "}
                    <Link
                        to="/guest"
                        className="font-semibold text-cyan-700 transition hover:text-slate-950 dark:text-cyan-300 dark:hover:text-white"
                    >
                        Continue as Guest
                    </Link>
                </p>
            </AuthFormShell>
        </div>
    );
};

export default Login;
