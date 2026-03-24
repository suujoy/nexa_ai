/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                light: {
                    bg: "#F8FAFC",
                    surface: "#FFFFFF",
                    text: "#0F172A",
                    secondary: "#64748B",
                    accent: "#0EA5E9",
                },
                dark: {
                    bg: "#0F172A",
                    surface: "#1E293B",
                    text: "#E2E8F0",
                    secondary: "#94A3B8",
                    accent: "#38BDF8",
                },
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
