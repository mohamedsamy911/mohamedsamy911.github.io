import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

/* gtag is defined by the inline snippet in index.html */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __GA_ID__?: string;
  }
}

const STORAGE_KEY = "analytics-consent";

const grant = () =>
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
  });

const ConsentBanner: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // No GA configured → never show the banner.
    if (!window.__GA_ID__) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "granted") grant();
    else if (stored !== "denied") setVisible(true);
  }, []);

  if (!visible) return null;

  const decide = (accepted: boolean) => {
    localStorage.setItem(STORAGE_KEY, accepted ? "granted" : "denied");
    if (accepted) grant();
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:max-w-sm z-[60] rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
        isDark
          ? "bg-slate-900/95 border-slate-700 text-slate-300"
          : "bg-white/95 border-slate-200 text-slate-600"
      }`}
    >
      <p className="text-sm leading-relaxed mb-3">
        This site uses analytics cookies to understand traffic. You can accept or
        decline.
      </p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => decide(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            isDark
              ? "text-slate-400 hover:bg-slate-800"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          Decline
        </button>
        <button
          onClick={() => decide(true)}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default ConsentBanner;
