import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle({ className = "", iconSize = 17 }) {
    const { theme, setTheme, appliedTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors ${className}`}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
            {appliedTheme === "dark" ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
        </button>
    );
}
