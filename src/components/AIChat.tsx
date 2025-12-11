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
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { API_KEY, RESUME_CONTENT } from "../constants";

interface Message {
  text: string;
  sender: "user" | "gemini";
}

interface AIChatProps {
  theme: string;
}

interface Message {
  text: string;
  sender: "user" | "gemini";
}

const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

const AIChat: React.FC<AIChatProps> = ({ theme }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] =
    useState<boolean>(false);
  const [isFeaturesCollapsed, setIsFeaturesCollapsed] =
    useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callGeminiAPI = async (prompt: string): Promise<string> => {
    let chatHistory = [];
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
      let responseText = result.candidates[0].content.parts[0].text;
      const cleanedText = responseText
        ?.replace(/^```markdown\n/, "")
        ?.replace(/\n```$/, "");

      return cleanedText ? cleanedText : "";
    } else {
      console.error("Gemini API response structure unexpected:", result);
      throw new Error("Unexpected API response structure.");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const prompt = `Respond in the same language as the user's question, or if a specific language is mentioned, use that language.
      Based on the following resume information, answer the user's question. If the information is not explicitly in the resume, state that you cannot find it.

      Resume:
      ${RESUME_CONTENT}

      User's question: ${input}`;

      const geminiResponseText = await callGeminiAPI(prompt);
      const geminiMessage: Message = {
        text: geminiResponseText,
        sender: "gemini",
      };
      setMessages((prevMessages) => [...prevMessages, geminiMessage]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage: Message = {
        text: "There was an error connecting to Gemini. Please try again later.",
        sender: "gemini",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarizeResume = async () => {
    setIsSummarizing(true);
    const userMessage: Message = {
      text: "Summarize my resume.",
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const prompt = `Respond in the same language as the user's question, or if a specific language is mentioned, use that language.
      Provide a concise summary of the following resume, highlighting key skills, experience, and achievements. Format the summary using Markdown.

      Resume:
      ${RESUME_CONTENT}`;

      const geminiResponseText = await callGeminiAPI(prompt);
      const geminiMessage: Message = {
        text: geminiResponseText,
        sender: "gemini",
      };
      setMessages((prevMessages) => [...prevMessages, geminiMessage]);
    } catch (error) {
      console.error("Error summarizing resume:", error);
      const errorMessage: Message = {
        text: "Sorry, I couldn't summarize the resume. Please try again.",
        sender: "gemini",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateInterviewQuestions = async () => {
    setIsGeneratingQuestions(true);
    const userMessage: Message = {
      text: "Generate interview questions based on my resume.",
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const prompt = `Respond in the same language as the user's question, or if a specific language is mentioned, use that language.
      Generate 3-5 common interview questions based on the content of the following resume. Focus on areas like experience, projects, and skills. Format the questions as a numbered list using Markdown.

      Resume:
      ${RESUME_CONTENT}`;

      const geminiResponseText = await callGeminiAPI(prompt);
      const geminiMessage: Message = {
        text: geminiResponseText,
        sender: "gemini",
      };
      setMessages((prevMessages) => [...prevMessages, geminiMessage]);
    } catch (error) {
      console.error("Error generating interview questions:", error);
      const errorMessage: Message = {
        text: "Sorry, I couldn't generate interview questions. Please try again.",
        sender: "gemini",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-4 right-4 text-white rounded-full p-4 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 z-50 transform hover:scale-105 cursor-pointer
          ${
            theme === "dark"
              ? "bg-indigo-800 hover:bg-indigo-700"
              : "bg-indigo-600 hover:bg-indigo-500"
          }
          `}
        aria-label="Open chat"
      >
        <MessageSquare className="h-8 w-8" />
      </button>

      {/* Chat Component */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 600, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ y: 600, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed bottom-0 left-0 w-full h-[75vh] sm:bottom-4 sm:left-4 sm:w-96 sm:h-[70vh] rounded-lg shadow-2xl flex flex-col overflow-hidden z-50 transition-all duration-300 ease-in-out
              ${theme === "dark" ? "bg-gray-900" : "bg-white"}
              `}
          >
            {/* Header */}
            <div
              className={`bg-gradient-to-r p-4 rounded-t-lg shadow-md flex justify-between items-center
              ${
                theme === "dark"
                  ? "from-indigo-800 to-indigo-700 text-amber-50"
                  : "from-indigo-600 to-indigo-500 text-white"
              }
              `}
            >
              <h1 className="text-xl font-bold">Chat with Samys' Resume</h1>
              <div className="flex items-center space-x-2">
                {/* Collapse/Expand Features Button */}
                <button
                  onClick={() => setIsFeaturesCollapsed(!isFeaturesCollapsed)}
                  className="text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
                  aria-label={
                    isFeaturesCollapsed
                      ? "Expand features"
                      : "Collapse features"
                  }
                >
                  <ChevronDown
                    className={`h-6 w-6 transition-transform duration-300 cursor-pointer ${
                      isFeaturesCollapsed ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {/* Close Chat Button */}
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-white hover:text-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
                  aria-label="Close chat"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Feature Buttons */}
            <div
              className={`border-b flex flex-wrap gap-2 justify-center transition-all duration-300
                ${
                  isFeaturesCollapsed
                    ? "max-h-0 overflow-hidden p-0 border-b-0"
                    : "max-h-48 p-3"
                }
                ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-300 border-gray-700"
                    : "bg-white text-gray-800 border-gray-200"
                }
                `}
            >
              <button
                onClick={handleSummarizeResume}
                className={`text-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center
                  ${
                    theme === "dark"
                      ? "bg-green-600 hover:bg-green-500 focus:ring-green-500"
                      : "bg-green-500 hover:bg-green-400 focus:ring-green-300"
                  }
                  `}
                disabled={isSummarizing || isLoading || isGeneratingQuestions}
              >
                <FileText className="mr-2" size={16} />✨ Summarize Resume
              </button>
              <button
                onClick={handleGenerateInterviewQuestions}
                className={`text-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center
                  ${
                    theme === "dark"
                      ? "bg-purple-600 hover:bg-purple-500 focus:ring-purple-500"
                      : "bg-purple-500 hover:bg-purple-400 focus:ring-purple-300"
                  }
                  `}
                disabled={isGeneratingQuestions || isLoading || isSummarizing}
              >
                <HelpCircle className="mr-2" size={16} />✨ Generate Interview
                Questions
              </button>
            </div>

            {/* Chat Messages Area */}
            <div
              className={`flex-1 p-4 overflow-y-auto space-y-4 overscroll-y-contain
              ${theme === "dark" ? "text-gray-300" : "text-gray-800"}
              `}
            >
              {messages.length === 0 && (
                <div className="text-center mt-10">
                  <p>Ask me anything about my resume!</p>
                  <p className="text-sm mt-2">
                    e.g., "How many years of experience do you have?" or "Tell
                    me about your e-commerce project."
                  </p>
                </div>
              )}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-end ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender !== "user" && (
                    <Bot
                      className={`mr-2 flex-shrink-0 ${
                        theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                      }`}
                      size={24}
                    />
                  )}
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl shadow-md ${
                      msg.sender === "user"
                        ? `${
                            theme === "dark"
                              ? "bg-indigo-600 text-white rounded-br-none"
                              : "bg-indigo-200 text-gray-800 rounded-bl-none"
                          }`
                        : `${
                            theme === "dark"
                              ? "bg-gray-800 text-gray-300 rounded-bl-none"
                              : "bg-gray-200 text-gray-800 rounded-br-none"
                          }`
                    }`}
                  >
                    <bdi>
                      {msg.sender === "gemini" ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text}
                        </ReactMarkdown>
                      ) : (
                        msg.text
                      )}
                    </bdi>
                  </div>
                  {msg.sender === "user" && (
                    <User
                      className={`ml-2 flex-shrink-0 ${
                        theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                      }`}
                      size={24}
                    />
                  )}
                </div>
              ))}
              {(isLoading || isSummarizing || isGeneratingQuestions) && (
                <div className="flex justify-start items-end">
                  <Bot
                    className={`mr-2 flex-shrink-0 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                    }`}
                    size={24}
                  />
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl shadow-md ${
                      theme === "dark"
                        ? "bg-gray-800 text-gray-300 rounded-bl-none"
                        : "bg-gray-200 text-gray-800 rounded-br-none"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="animate-bounce text-xl mr-1">.</span>
                      <span className="animate-bounce text-xl mr-1 delay-75">
                        .
                      </span>
                      <span className="animate-bounce text-xl delay-150">
                        .
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className={`p-4 border-t rounded-b-lg
                ${
                  theme === "dark"
                    ? "border-gray-700 bg-gray-900"
                    : "border-gray-200 bg-gray-50"
                }
                `}
            >
              <div className="flex space-x-3">
                <input
                  type="text"
                  dir="auto"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about my resume..."
                  className={`flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200
                    ${
                      theme === "dark"
                        ? "bg-gray-800 text-gray-300 placeholder-gray-500"
                        : "bg-white text-gray-800 placeholder-gray-400"
                    }
                    `}
                  disabled={isLoading || isSummarizing || isGeneratingQuestions}
                />
                <button
                  type="submit"
                  className={`text-white px-4 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center
                    ${
                      theme === "dark"
                        ? "bg-indigo-800 hover:bg-indigo-700 focus:ring-indigo-500"
                        : "bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-400"
                    }
                    `}
                  disabled={isLoading || isSummarizing || isGeneratingQuestions}
                >
                  {isLoading ? "Sending..." : <Send className="h-5 w-5" />}
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
