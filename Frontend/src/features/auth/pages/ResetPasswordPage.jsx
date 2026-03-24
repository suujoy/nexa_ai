import { useState } from "react";
import { useSearchParams } from "react-router";
import Navbar from "../../../components/Navbar";
import AuthErrorAlert from "../components/AuthErrorAlert";
import AuthFormShell from "../components/AuthFormShell";
import AuthRedirectText from "../components/AuthRedirectText";
import PasswordField from "../components/PasswordField";
import useAuth from "../hooks/useAuth";

const ResetPasswordPage = () => {
    const [params] = useSearchParams();
    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });
    const { resetPassword, loading, error, successMessage, clearAuthError } =
        useAuth();

    const token = params.get("token");

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearAuthError();

        if (!token || form.password !== form.confirmPassword) {
            return;
        }

        try {
            await resetPassword(token, { password: form.password });
        } catch {
            // handled in auth state
        }
    };

    const mismatchError =
        form.confirmPassword && form.password !== form.confirmPassword
            ? "Passwords do not match"
            : null;

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#eef6ff_0%,#f8fbff_52%,#f2f7ff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_24%),linear-gradient(180deg,#020617_0%,#07111f_52%,#020617_100%)]">
            <Navbar />

            <AuthFormShell
                eyebrow="Reset Password"
                title="Choose a new password"
                description="Set a fresh password for your account and return to login."
                sideNote="This page requires a valid reset token"
            >
                <AuthErrorAlert message={error || mismatchError} />
                {successMessage ? (
                    <div className="mb-5 rounded-[1.3rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                        {successMessage}
                    </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        <PasswordField
                            label="New Password"
                            placeholder="Enter your new password"
                            value={form.password}
                            onChange={handleChange}
                            name="password"
                        />

                        <PasswordField
                            label="Confirm Password"
                            placeholder="Confirm your new password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            name="confirmPassword"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !token}
                        className="w-full rounded-[1.4rem] bg-[linear-gradient(135deg,#0891b2,#2563eb,#0f172a)] px-5 py-3.5 text-sm font-semibold tracking-[0.18em] text-white shadow-[0_20px_40px_rgba(8,145,178,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_55px_rgba(37,99,235,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? "RESETTING..." : "RESET PASSWORD"}
                    </button>
                </form>

                <AuthRedirectText
                    text="Need to sign in instead?"
                    linkText="Back to login"
                    to="/login"
                />
            </AuthFormShell>
        </div>
    );
};

export default ResetPasswordPage;
