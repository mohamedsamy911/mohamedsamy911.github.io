import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className }: { readonly className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      // Target is 44x44 (WCAG 2.5.8 recommends 44; minimum is 24).
      className={[
        "inline-flex h-11 w-11 items-center justify-center text-ink-muted transition-colors hover:text-ink",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
      ) : (
        <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
      )}
    </button>
  );
}
