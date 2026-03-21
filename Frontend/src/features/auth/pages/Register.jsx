import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import ThemeToggle from "../../theme/ThemeToggle";

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);

    const { handleRegister } = useAuth();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = { name, username, email, password };

        try {
            await handleRegister(payload);
            setSuccess(true);
        } catch {
            // error is stored in Redux via setError
        }
    };

    return (
        <div className="min-h-screen text-slate-900 transition-colors dark:text-slate-100">
            <div className="mx-auto relative flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
                <div className="absolute top-5 right-5">
                    <ThemeToggle />
                </div>
                <div className="w-full max-w-md rounded-2xl border border-pink-300/40 bg-white/80 p-8 shadow-[0_0_40px_rgba(16,185,129,0.14)] backdrop-blur dark:border-pink-400/30 dark:bg-slate-900/80 dark:shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                    <h1 className="mb-2 text-3xl font-bold text-pink-500 dark:text-pink-300">
                        Create Account
                    </h1>
                    <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
                        Join now and set up your profile.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-emerald-600 dark:text-emerald-300"
                            >
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                required
                                placeholder="Your full name"
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-500/30 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="username"
                                className="mb-2 block text-sm font-medium text-emerald-600 dark:text-emerald-300"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                                required
                                placeholder="Choose a username"
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-500/30 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-emerald-600 dark:text-emerald-300"
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
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-500/30 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-emerald-600 dark:text-emerald-300"
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
                                placeholder="Create your password"
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-500/30 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-pink-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-pink-400 disabled:opacity-60"
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>

                        {error && (
                            <p className="text-center text-sm text-red-500">{error}</p>
                        )}

                        {success && (
                            <p className="text-center text-sm text-emerald-500">
                                ✅ Registered! Check your email to verify your account, then{" "}
                                <Link to="/login" className="underline">login</Link>.
                            </p>
                        )}
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
