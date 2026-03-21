import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import ThemeToggle from "../../theme/ThemeToggle";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { user } = useSelector((state) => state.auth);
    const { loading } = useSelector((state) => state.auth);

    const { handleLogin } = useAuth();

    const handleSubmit = (event) => {
        event.preventDefault();

        const payload = {
            email,
            password,
        };

        handleLogin(payload);
        console.log("Login form submitted:", payload);
        navigate("/");
    };

    if (!loading && user) {
        return <Navigate to={"/"} />;
    }

    return (
        <div className="min-h-screen  text-slate-900 transition-colors dark:text-slate-100">
            {/* <div className="flex justify-end px-4 pt-4">
                
            </div> */}
            <div className="mx-auto relative flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
                <div className="absolute top-5 right-5">
                    <ThemeToggle />
                </div>
                <div className="w-full max-w-md rounded-2xl border border-emerald-300/40 bg-white/80 p-8 shadow-[0_0_40px_rgba(236,72,153,0.12)] backdrop-blur dark:border-emerald-400/30 dark:bg-slate-900/80 dark:shadow-[0_0_40px_rgba(236,72,153,0.2)]">
                    <h1 className="mb-2 text-3xl font-bold text-emerald-600 dark:text-emerald-300">
                        Sign In
                    </h1>
                    <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
                        Welcome back. Enter your details.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-pink-500 dark:text-pink-300"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-pink-500 dark:text-pink-300"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                required
                                placeholder="Enter your password"
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                            Login
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-pink-500 transition hover:text-pink-400 dark:text-pink-300 dark:hover:text-pink-200"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
