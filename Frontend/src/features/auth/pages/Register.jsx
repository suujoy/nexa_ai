import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../../../components/Navbar";
import AuthErrorAlert from "../components/AuthErrorAlert";
import AuthFormShell from "../components/AuthFormShell";
import AuthRedirectText from "../components/AuthRedirectText";
import FormGroup from "../components/FormGroup";
import PasswordField from "../components/PasswordField";
import useAuth from "../hooks/useAuth";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const { register, loading, error, clearAuthError } = useAuth();

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearAuthError();

        if (form.password !== form.confirmPassword) {
            return;
        }

        try {
            await register({
                name: form.name,
                email: form.email,
                username: form.username,
                password: form.password,
            });
        } catch {
            // handled in auth state
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#eef6ff_0%,#f8fbff_52%,#f2f7ff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_24%),linear-gradient(180deg,#020617_0%,#07111f_52%,#020617_100%)]">
            <Navbar />

            <AuthFormShell
                eyebrow="Register"
                title="Create your Nexa account"
                description="Set up your identity once, then move into authentication, chat, and model switching without friction."
                sideNote="Secure entry with password confirmation"
            >
                <AuthErrorAlert
                    message={
                        error ||
                        (form.password !== form.confirmPassword &&
                        form.confirmPassword
                            ? "Passwords do not match"
                            : null)
                    }
                />

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormGroup
                            label="Full Name"
                            type="text"
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={handleChange}
                            name="name"
                        />

                        <FormGroup
                            label="Username"
                            type="text"
                            placeholder="Choose a username"
                            value={form.username}
                            onChange={handleChange}
                            name="username"
                        />
                    </div>

                    <FormGroup
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email address"
                        value={form.email}
                        onChange={handleChange}
                        name="email"
                    />

                    <div className="grid gap-5 md:grid-cols-2">
                        <PasswordField
                            label="Password"
                            placeholder="Create a password"
                            value={form.password}
                            onChange={handleChange}
                            name="password"
                        />

                        <PasswordField
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            name="confirmPassword"
                        />
                    </div>

                    <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                        Use a strong password and make sure both password fields
                        match before submitting.
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-[1.4rem] bg-[linear-gradient(135deg,#0891b2,#2563eb,#0f172a)] px-5 py-3.5 text-sm font-semibold tracking-[0.18em] text-white shadow-[0_20px_40px_rgba(8,145,178,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_55px_rgba(37,99,235,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? "CREATING..." : "CREATE ACCOUNT"}
                    </button>
                </form>

                <AuthRedirectText
                    text="Already have an account?"
                    linkText="Sign in"
                    to="/login"
                />
                <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-300">
                    Prefer a quick trial?{" "}
                    <Link
                        to="/guest"
                        className="font-semibold text-cyan-700 transition hover:text-slate-950 dark:text-cyan-300 dark:hover:text-white"
                    >
                        Open Guest Chat
                    </Link>
                </p>
            </AuthFormShell>
        </div>
    );
};

export default Register;
