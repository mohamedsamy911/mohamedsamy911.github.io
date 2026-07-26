import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

type ThemeToggleProps = {
  readonly className?: string;
};

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={[
        "relative w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-700 focus:outline-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={`Toggle ${theme === "light" ? "dark" : "light"} mode`}
    >
      <motion.div
        className={`absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
          theme === "light" ? "bg-yellow-400" : "bg-slate-300"
        }`}
        initial={false}
        animate={{
          x: theme === "light" ? 1 : 26,
          transition: { type: "spring", stiffness: 700, damping: 30 },
        }}
      >
        {theme === "light" ? (
          <svg
            className="w-4 h-4 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 text-slate-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </motion.div>
    </button>
  );
}
