import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { useTheme } from "../context/ThemeContext";

// Heavy panel (Gemini SDK + markdown) loads only when the chat is first opened.
const AIChatPanel = lazy(() => import("./AIChatPanel"));

const AIChat: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setIsChatOpen(true)}
            className={`fixed bottom-5 right-5 rounded-full p-4 shadow-xl z-50 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 ${
              isDark
                ? "bg-blue-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50"
                : "bg-blue-600 text-white shadow-blue-400/40 hover:shadow-blue-400/60"
            }`}
            aria-label="Open chat"
          >
            <MessageSquare className="w-6 h-6" />
            {/* Notification Dot */}
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window (lazy) */}
      <AnimatePresence>
        {isChatOpen && (
          <Suspense fallback={null}>
            <AIChatPanel onClose={() => setIsChatOpen(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;
