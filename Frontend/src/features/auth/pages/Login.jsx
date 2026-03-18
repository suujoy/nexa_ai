import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

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
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
                <div className="w-full max-w-md rounded-2xl border border-emerald-400/30 bg-slate-900/80 p-8 shadow-[0_0_40px_rgba(236,72,153,0.2)] backdrop-blur">
                    <h1 className="mb-2 text-3xl font-bold text-emerald-300">
                        Sign In
                    </h1>
                    <p className="mb-8 text-sm text-slate-400">
                        Welcome back. Enter your details.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-pink-300"
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
                                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-pink-300"
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
                                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                            Login
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-400">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-pink-300 transition hover:text-pink-200"
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
