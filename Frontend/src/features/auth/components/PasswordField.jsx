import { useState } from "react";

const PasswordField = ({
    label,
    placeholder,
    value,
    onChange,
    name,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>

            <input
                name={name}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />

            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[2.45rem] text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3l18 18"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.58 10.58A2 2 0 0013.42 13.42"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.88 5.09A9.77 9.77 0 0112 4.8c4.4 0 8.15 2.69 9.5 6.5a9.96 9.96 0 01-3.02 4.22M6.61 6.61A10.02 10.02 0 002.5 11.3a9.96 9.96 0 004.77 5.36A9.75 9.75 0 0012 17.8c1.13 0 2.22-.19 3.23-.54"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
                        />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default PasswordField;
