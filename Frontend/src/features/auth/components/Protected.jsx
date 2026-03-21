import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
    const user = useSelector((state) => state.auth.user);
    const loading = useSelector((state) => state.auth.loading);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center text-slate-700 dark:text-slate-200">
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
                    Loading...
                </div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    return children;
};

export default Protected;
