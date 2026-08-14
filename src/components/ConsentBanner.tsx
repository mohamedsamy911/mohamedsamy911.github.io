import { useEffect, useState } from "react";

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
      className="fixed inset-x-4 bottom-4 z-[60] border border-rule-strong bg-surface p-5 sm:left-auto sm:max-w-sm"
    >
      <p className="text-sm leading-relaxed text-ink-muted">
        This site uses analytics cookies to understand traffic. You can accept
        or decline.
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => decide(false)}
          className="px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => decide(true)}
          className="bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default ConsentBanner;
