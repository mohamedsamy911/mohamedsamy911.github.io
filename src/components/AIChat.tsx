import { AnimatePresence, motion } from "framer-motion";
import { GoogleGenAI } from "@google/genai";
import {
  Bot,
  ChevronDown,
  FileText,
  HelpCircle,
  MessageSquare,
  Send,
  User,
  X,
  Trash2,
  Sparkles,
  Loader2,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { API_KEY, RESUME_CONTENT } from "../constants";
import { useTheme } from "../context/ThemeContext";

interface Message {
  text: string;
  sender: "user" | "gemini";
}

const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

const AIChat: React.FC = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isFeaturesCollapsed, setIsFeaturesCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";
  const isBusy = isLoading || isSummarizing || isGeneratingQuestions;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ─── API ─────────────────────────────────────────────────── */

  const callGeminiAPI = async (
    prompt: string,
    currentMessages: Message[]
  ): Promise<string> => {
    const chatHistory = currentMessages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: chatHistory,
    });

    const result = response;
    if (
      result.candidates &&
      result.candidates.length > 0 &&
      result.candidates[0].content &&
      result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0
    ) {
      const responseText = result.candidates[0].content.parts[0].text;
      const cleanedText = responseText
        ?.replace(/^```markdown\n/, "")
        ?.replace(/\n```$/, "");
      return cleanedText ? cleanedText : "";
    } else {
      console.error("Gemini API response structure unexpected:", result);
      throw new Error("Unexpected API response structure.");
    }
  };

  /* ─── Handlers ────────────────────────────────────────────── */

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const prompt = `Respond in the same language as the user's question, or if a specific language is mentioned, use that language.
      Based on the following resume information, answer the user's question. If the information is not explicitly in the resume, state that you cannot find it.

      Resume:
      ${RESUME_CONTENT}

      User's question: ${input}`;

      const text = await callGeminiAPI(prompt, messages);
      setMessages((prev) => [...prev, { text, sender: "gemini" }]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "There was an error connecting to Gemini. Please try again later.",
          sender: "gemini",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarizeResume = async () => {
    setIsSummarizing(true);
    setMessages((prev) => [
      ...prev,
      { text: "Summarize my resume.", sender: "user" },
    ]);

    try {
      const prompt = `Respond in the same language as the user's question, or if a specific language is mentioned, use that language.
      Provide a concise summary of the following resume, highlighting key skills, experience, and achievements. Format the summary using Markdown.

      Resume:
      ${RESUME_CONTENT}`;

      const text = await callGeminiAPI(prompt, messages);
      setMessages((prev) => [...prev, { text, sender: "gemini" }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I couldn't summarize the resume. Please try again.",
          sender: "gemini",
        },
      ]);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateInterviewQuestions = async () => {
    setIsGeneratingQuestions(true);
    setMessages((prev) => [
      ...prev,
      {
        text: "Generate interview questions based on my resume.",
        sender: "user",
      },
    ]);

    try {
      const prompt = `Respond in the same language as the user's question, or if a specific language is mentioned, use that language.
      Generate 3-5 common interview questions based on the content of the following resume. Focus on areas like experience, projects, and skills. Format the questions as a numbered list using Markdown.

      Resume:
      ${RESUME_CONTENT}`;

      const text = await callGeminiAPI(prompt, messages);
      setMessages((prev) => [...prev, { text, sender: "gemini" }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I couldn't generate interview questions. Please try again.",
          sender: "gemini",
        },
      ]);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  /* ─── Quick Action Button ─────────────────────────────────── */

  const QuickAction: React.FC<{
    onClick: () => void;
    disabled: boolean;
    icon: React.ReactNode;
    label: string;
    color: "green" | "purple";
  }> = ({ onClick, disabled, icon, label, color }) => {
    const colorClasses = {
      green: isDark
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
        : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
      purple: isDark
        ? "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20"
        : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${colorClasses[color]}`}
      >
        {icon}
        {label}
      </button>
    );
  };

  /* ─── Render ──────────────────────────────────────────────── */

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
                ? "bg-indigo-600 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50"
                : "bg-indigo-600 text-white shadow-indigo-400/40 hover:shadow-indigo-400/60"
            }`}
            aria-label="Open chat"
          >
            <MessageSquare className="w-6 h-6" />
            {/* Notification Dot */}
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`fixed z-50 flex flex-col overflow-hidden
              /* Mobile: full screen */
              inset-0
              /* Small screens: anchored bottom-right */
              sm:inset-auto sm:bottom-5 sm:right-5 sm:w-[400px] sm:h-[min(75vh,640px)] sm:rounded-2xl
              /* Medium+ screens: slightly larger */
              md:w-[420px] md:h-[min(80vh,700px)]
              ${
                isDark
                  ? "bg-gray-900 sm:border sm:border-gray-700/60 sm:shadow-2xl sm:shadow-black/40"
                  : "bg-white sm:border sm:border-gray-200 sm:shadow-2xl sm:shadow-gray-300/50"
              }
            `}
          >
            {/* ── Header ──────────────────────────────────── */}
            <div
              className={`shrink-0 px-4 py-3 flex items-center justify-between gap-3 border-b ${
                isDark
                  ? "bg-gray-900 border-gray-800"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isDark
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "bg-indigo-100 text-indigo-600"
                  }`}
                >
                  <Bot className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2
                    className={`text-sm font-bold truncate ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Chat with Samy's Resume
                  </h2>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Powered by Gemini AI
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {messages.length > 0 && (
                  <button
                    onClick={handleClearChat}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      isDark
                        ? "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                    aria-label="Clear chat"
                    title="Clear chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() =>
                    setIsFeaturesCollapsed(!isFeaturesCollapsed)
                  }
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    isDark
                      ? "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label={
                    isFeaturesCollapsed
                      ? "Show quick actions"
                      : "Hide quick actions"
                  }
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isFeaturesCollapsed ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    isDark
                      ? "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Quick Actions ────────────────────────────── */}
            <div
              className={`shrink-0 overflow-hidden transition-all duration-300 ${
                isFeaturesCollapsed
                  ? "max-h-0 border-b-0"
                  : "max-h-24 border-b"
              } ${
                isDark ? "border-gray-800" : "border-gray-100"
              }`}
            >
              <div className="flex gap-2 px-4 py-2.5 overflow-x-auto">
                <QuickAction
                  onClick={handleSummarizeResume}
                  disabled={isBusy}
                  icon={<FileText className="w-3.5 h-3.5" />}
                  label="Summarize"
                  color="green"
                />
                <QuickAction
                  onClick={handleGenerateInterviewQuestions}
                  disabled={isBusy}
                  icon={<HelpCircle className="w-3.5 h-3.5" />}
                  label="Interview Q&A"
                  color="purple"
                />
              </div>
            </div>

            {/* ── Messages ─────────────────────────────────── */}
            <style>{`
              .chat-scrollbar::-webkit-scrollbar { width: 5px; }
              .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .chat-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.2)"}; border-radius: 9999px; }
              .chat-scrollbar::-webkit-scrollbar-thumb:hover { background: ${isDark ? "rgba(99,102,241,0.45)" : "rgba(99,102,241,0.4)"}; }
              .chat-scrollbar { scrollbar-width: thin; scrollbar-color: ${isDark ? "rgba(99,102,241,0.25) transparent" : "rgba(99,102,241,0.2) transparent"}; }
            `}</style>
            <div
              className={`flex-1 overflow-y-auto overscroll-y-contain px-4 py-4 space-y-3 chat-scrollbar ${
                isDark ? "text-gray-300" : "text-gray-800"
              }`}
            >
              {/* Empty State */}
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${
                      isDark
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "bg-indigo-100 text-indigo-600"
                    }`}
                  >
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3
                    className={`text-lg font-bold mb-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Ask me anything!
                  </h3>
                  <p
                    className={`text-sm mb-6 max-w-[260px] ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    I can answer questions about Mohamed's experience, skills,
                    and projects.
                  </p>
                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      "Tell me about your experience",
                      "What tech stack do you use?",
                      "Describe a major project",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setInput(suggestion);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                          isDark
                            ? "bg-gray-800/60 border-gray-700 text-gray-400 hover:text-indigo-400 hover:border-indigo-500/30"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-300"
                        }`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Bubbles */}
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-2 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender !== "user" && (
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mb-0.5 ${
                        isDark
                          ? "bg-indigo-500/10 text-indigo-400"
                          : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? `rounded-2xl rounded-br-md ${
                            isDark
                              ? "bg-indigo-600 text-white"
                              : "bg-indigo-600 text-white"
                          }`
                        : `rounded-2xl rounded-bl-md ${
                            isDark
                              ? "bg-gray-800 text-gray-300 border border-gray-700/50"
                              : "bg-gray-100 text-gray-800"
                          }`
                    }`}
                  >
                    <bdi>
                      {msg.sender === "gemini" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_code]:text-xs [&_pre]:text-xs">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </bdi>
                  </div>
                  {msg.sender === "user" && (
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mb-0.5 ${
                        isDark
                          ? "bg-indigo-500/10 text-indigo-400"
                          : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isBusy && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2 justify-start"
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mb-0.5 ${
                      isDark
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "bg-indigo-100 text-indigo-600"
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl rounded-bl-md ${
                      isDark
                        ? "bg-gray-800 border border-gray-700/50"
                        : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-2 h-2 rounded-full animate-bounce ${
                          isDark ? "bg-indigo-400" : "bg-indigo-500"
                        }`}
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className={`w-2 h-2 rounded-full animate-bounce ${
                          isDark ? "bg-indigo-400" : "bg-indigo-500"
                        }`}
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className={`w-2 h-2 rounded-full animate-bounce ${
                          isDark ? "bg-indigo-400" : "bg-indigo-500"
                        }`}
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ── Input ────────────────────────────────────── */}
            <form
              onSubmit={handleSendMessage}
              className={`shrink-0 p-3 border-t ${
                isDark
                  ? "border-gray-800 bg-gray-900"
                  : "border-gray-100 bg-white"
              }`}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  dir="auto"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about my resume..."
                  className={`flex-1 px-4 py-2.5 text-sm rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    isDark
                      ? "bg-gray-800 border-gray-700/60 text-white placeholder-gray-500 focus:border-indigo-500/50"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-400"
                  }`}
                  disabled={isBusy}
                />
                <button
                  type="submit"
                  disabled={isBusy || input.trim() === ""}
                  className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                    isDark
                      ? "bg-indigo-600 text-white hover:bg-indigo-500 disabled:hover:bg-indigo-600"
                      : "bg-indigo-600 text-white hover:bg-indigo-500 disabled:hover:bg-indigo-600"
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;
