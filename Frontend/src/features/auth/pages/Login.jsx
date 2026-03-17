import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Login = () => {
    const navigate = useNavigate();
    const { handleLogin } = useAuth();

    const { user } = useSelector((state) => state.auth);
    const { loading } = useSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            email,
            password,
        };
        
        await handleLogin(payload);
        
        navigate("/");
    };
    
    
    if (!loading && user) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
            <div className="w-full max-w-md rounded-2xl border border-rose-300/20 bg-zinc-900 p-8 shadow-2xl">
                <h2 className="mb-2 text-center text-3xl font-semibold text-emerald-400">
                    Login
                </h2>
                <p className="mb-6 text-center text-sm text-rose-200/70">
                    Welcome back
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-sm text-zinc-300">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-zinc-300">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-emerald-600 py-2 text-white transition hover:bg-emerald-500"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-zinc-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-rose-300 transition hover:text-rose-200"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
