import { useState } from "react";
import Navbar from "../../../components/Navbar";
import AuthErrorAlert from "../components/AuthErrorAlert";
import AuthFormShell from "../components/AuthFormShell";
import AuthRedirectText from "../components/AuthRedirectText";
import FormGroup from "../components/FormGroup";
import useAuth from "../hooks/useAuth";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const { forgotPassword, loading, error, successMessage, clearAuthError } =
        useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearAuthError();

        try {
            await forgotPassword({ email });
        } catch {
            // handled in state
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#eef6ff_0%,#f8fbff_52%,#f2f7ff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_24%),linear-gradient(180deg,#020617_0%,#07111f_52%,#020617_100%)]">
            <Navbar />

            <AuthFormShell
                eyebrow="Forgot Password"
                title="Reset your password"
                description="Enter the email linked to your account and we will send you a reset link."
                sideNote="Password reset works through email"
            >
                <AuthErrorAlert message={error} />
                {successMessage ? (
                    <div className="mb-5 rounded-[1.3rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                        {successMessage}
                    </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <FormGroup
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-[1.4rem] bg-[linear-gradient(135deg,#0891b2,#2563eb,#0f172a)] px-5 py-3.5 text-sm font-semibold tracking-[0.18em] text-white shadow-[0_20px_40px_rgba(8,145,178,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_55px_rgba(37,99,235,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? "SENDING..." : "SEND RESET LINK"}
                    </button>
                </form>

                <AuthRedirectText
                    text="Remembered your password?"
                    linkText="Back to login"
                    to="/login"
                />
            </AuthFormShell>
        </div>
    );
};

export default ForgotPasswordPage;
