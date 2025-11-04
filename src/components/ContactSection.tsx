import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

interface ContactSectionProps {
  readonly theme: string;
}

const GitHubIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.08-.731.084-.716.084-.716 1.192.085 1.816 1.229 1.816 1.229 1.064 1.814 2.792 1.299 3.473.993.108-.775.418-1.299.762-1.599-2.651-.301-5.438-1.327-5.438-5.923 0-1.31.465-2.381 1.229-3.221-.124-.301-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.22.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.542 3.297-1.22 3.297-1.22.653 1.653.242 2.875.118 3.176.766.84 1.228 1.911 1.228 3.221 0 4.609-2.792 5.625-5.446 5.922.43.369.815 1.096.815 2.221v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const ContactSection: React.FC<ContactSectionProps> = ({ theme }) => {
  const form = useRef<HTMLFormElement>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean | null>(null);

  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendSuccess(null); // Reset status

    if (!PUBLIC_KEY || !TEMPLATE_ID) {
      console.error(
        "EmailJS Public Key or Template ID is not configured. Please check your .env or GitHub Secrets."
      );
      setSendSuccess(false);
      setIsSending(false);
      return;
    }

    if (form.current) {
      console.log(form.current);
      emailjs
        .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
        .then(
          (result) => {
            console.log("Email successfully sent!", result.text);
            setSendSuccess(true);
            setName("");
            setEmail("");
            setMessage("");
          },
          (error) => {
            console.error("Failed to send email:", error.text);
            setSendSuccess(false);
          }
        )
        .finally(() => {
          setIsSending(false);
        });
    }
  };
  return (
    <section
      id="contact"
      className={`min-h-screen w-full py-20 px-4 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2
            className={`text-4xl md:text-5xl font-bold mb-8 text-center ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Get In{" "}
            <span className="text-indigo-600 dark:text-indigo-400">Touch</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3
                className={`text-2xl font-bold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      theme === "dark" ? "bg-indigo-500/10" : "bg-indigo-100"
                    }`}
                  >
                    <svg
                      className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4
                      className={`font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Email
                    </h4>
                    <a
                      href="mailto:mohamedadel74@gmail.com"
                      className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      mohamedadel74@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      theme === "dark" ? "bg-indigo-500/10" : "bg-indigo-100"
                    }`}
                  >
                    <svg
                      className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4
                      className={`font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Phone
                    </h4>
                    <a
                      href="tel:+201203208888"
                      className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      +20 120 320 8888
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3
                  className={`text-2xl font-bold mb-6 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Follow Me
                </h3>
                <div className="flex space-x-4">
                  {[
                    {
                      name: "github",
                      link: "https://github.com/mohamedsamy911",
                      "aria-label": "Github",
                    },
                    {
                      name: "linkedin",
                      link: "https://www.linkedin.com/in/mohamed-samy-ba0107141/",
                      "aria-label": "LinkedIn",
                    },
                  ].map((social) => (
                    <motion.a
                      key={social.name}
                      aria-label={social["aria-label"]}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer" // Added for security best practices
                      whileHover={{ y: -3 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        theme === "dark"
                          ? "bg-indigo-500/10 text-white hover:text-indigo-400"
                          : "bg-indigo-100 text-gray-900 hover:text-indigo-600"
                      }`}
                    >
                      {social.name === "github" && <GitHubIcon />}
                      {social.name === "linkedin" && <LinkedInIcon />}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className={`block mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="user_name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      theme === "dark"
                        ? "bg-gray-800 border border-gray-700 text-white"
                        : "bg-white border border-gray-300 text-gray-900"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className={`block mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="user_email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      theme === "dark"
                        ? "bg-gray-800 border border-gray-700 text-white"
                        : "bg-white border border-gray-300 text-gray-900"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className={`block mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      theme === "dark"
                        ? "bg-gray-800 border border-gray-700 text-white"
                        : "bg-white border border-gray-300 text-gray-900"
                    }`}
                    required
                  ></textarea>
                </div>

                <motion.button
                  disabled={isSending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors cursor-pointer ${
                    theme === "dark"
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  Send Message
                </motion.button>

                {sendSuccess === true && (
                  <p className="text-green-500 text-center mt-4">
                    Message sent successfully!
                  </p>
                )}
                {sendSuccess === false && (
                  <p className="text-red-500 text-center mt-4">
                    Failed to send message. Please try again later.
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
