import { useState } from "react";
import { Link } from "react-router";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      name,
      username,
      email,
      password,
    };

    console.log("Register form submitted:", payload);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-pink-400/30 bg-slate-900/80 p-8 shadow-[0_0_40px_rgba(16,185,129,0.2)] backdrop-blur">
          <h1 className="mb-2 text-3xl font-bold text-pink-300">Create Account</h1>
          <p className="mb-8 text-sm text-slate-400">Join now and set up your profile.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-emerald-300">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="Your full name"
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-500/30"
              />
            </div>

            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-emerald-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                placeholder="Choose a username"
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-500/30"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-emerald-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-500/30"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-emerald-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="Create your password"
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-500/30"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-pink-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-pink-400"
            >
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-emerald-300 transition hover:text-emerald-200"
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
