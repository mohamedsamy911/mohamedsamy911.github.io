import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { PUBLIC_KEY, SERVICE_ID, TEMPLATE_ID } from "../constants";
import { useTheme } from "../context/ThemeContext";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

/* ─── Contact Info Data ────────────────────────────────────── */

const contactInfo = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: "Email",
    value: "mohamedadel74@gmail.com",
    href: "mailto:mohamedadel74@gmail.com",
  },
  {
    icon: <Phone className="w-5 h-5" />,
    label: "Phone",
    value: "+966 50 655 7963",
    href: "tel:+966506557963",
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: "Location",
    value: "Riyadh, Saudi Arabia",
    href: null,
  },
];

const socials = [
  {
    name: "GitHub",
    icon: <Github className="w-5 h-5" />,
    link: "https://github.com/mohamedsamy911",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="w-5 h-5" />,
    link: "https://www.linkedin.com/in/mohamed-samy-ba0107141/",
  },
];

/* ─── Component ────────────────────────────────────────────── */

const ContactSection: React.FC = () => {
  const { theme } = useTheme();
  const form = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<boolean | null>(null);

  const isDark = theme === "dark";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendSuccess(null);

    if (!PUBLIC_KEY || !TEMPLATE_ID) {
      console.error(
        "EmailJS Public Key or Template ID is not configured."
      );
      setSendSuccess(false);
      setIsSending(false);
      return;
    }

    if (form.current) {
      emailjs
        .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
        .then(
          () => {
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
        .finally(() => setIsSending(false));
    }
  };

  const inputClass = `w-full rounded-xl px-4 py-3.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
    isDark
      ? "bg-slate-800/80 border border-slate-700/60 text-white placeholder-slate-500 focus:border-blue-500/50"
      : "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400"
  }`;

  return (
    <section
      id="contact"
      className={`w-full py-24 px-4 relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800"
          : "bg-gradient-to-b from-slate-50 via-white to-slate-50"
      }`}
      itemScope
      itemType="https://schema.org/ContactPage"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            isDark ? "bg-blue-600" : "bg-blue-300"
          }`}
        />
        <div
          className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            isDark ? "bg-sky-600" : "bg-sky-300"
          }`}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* ── Header ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className={`text-4xl md:text-6xl font-bold mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Get In{" "}
            <span className="text-blue-600 dark:text-blue-400">Touch</span>
          </h2>
          <p
            className={`text-lg max-w-xl mx-auto ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Building something that needs a full-stack engineer? Send a
            message — I read every one.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* ── Left Column — Contact Info ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 ${
                        isDark
                          ? "bg-slate-800/50 border-slate-700/50 hover:border-blue-500/40 hover:bg-slate-800/80"
                          : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md shadow-sm"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${
                          isDark
                            ? "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20"
                            : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p
                          className={`text-xs font-medium uppercase tracking-wider mb-0.5 ${
                            isDark ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          {item.label}
                        </p>
                        <p
                          className={`text-sm font-semibold ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {item.value}
                        </p>
                      </div>
                    </a>
                  ) : (
                    <div
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                        isDark
                          ? "bg-slate-800/50 border-slate-700/50"
                          : "bg-white border-slate-200 shadow-sm"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          isDark
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p
                          className={`text-xs font-medium uppercase tracking-wider mb-0.5 ${
                            isDark ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          {item.label}
                        </p>
                        <p
                          className={`text-sm font-semibold ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {item.value}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3
                className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Find Me On
              </h3>
              <div className="flex gap-3">
                {socials.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border font-medium text-sm transition-all duration-200 ${
                      isDark
                        ? "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-blue-500/40 hover:text-blue-400"
                        : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 shadow-sm"
                    }`}
                  >
                    {social.icon}
                    {social.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* CTA Text */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className={`rounded-2xl p-5 border ${
                isDark
                  ? "bg-gradient-to-br from-blue-900/20 to-sky-900/10 border-blue-600/20"
                  : "bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200/60"
              }`}
            >
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Available for{" "}
                <span
                  className={`font-semibold ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  freelance contracts
                </span>{" "}
                and full-time roles. If it involves React, NestJS, or{" "}
                <span
                  className={`font-semibold ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  backend infrastructure
                </span>
                , let's talk.
              </p>
            </motion.div>
          </motion.div>

          {/* ── Right Column — Contact Form ────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div
              className={`rounded-3xl p-8 md:p-10 border backdrop-blur-sm transition-all duration-300 ${
                isDark
                  ? "bg-slate-800/40 border-slate-700/50 shadow-2xl shadow-black/20"
                  : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"
              }`}
            >
              <h3
                className={`text-2xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Send a Message
              </h3>
              <p
                className={`text-sm mb-8 ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Fill out the form below and I'll get back to you as soon as
                possible.
              </p>

              <form ref={form} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="user_name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="user_email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                      isDark ? "text-slate-400" : "text-slate-500"
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
                    placeholder="Tell me about your project..."
                    className={`${inputClass} resize-none`}
                    required
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSending}
                  whileHover={{ scale: isSending ? 1 : 1.02 }}
                  whileTap={{ scale: isSending ? 1 : 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
                    ${
                      isSending
                        ? isDark
                          ? "bg-blue-600/50 text-blue-300"
                          : "bg-blue-400 text-white"
                        : isDark
                        ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                        : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-400/30 hover:shadow-blue-400/40"
                    }
                    disabled:cursor-not-allowed
                  `}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </motion.button>

                {/* Success / Error Feedback */}
                {sendSuccess === true && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-3 p-4 rounded-xl ${
                      isDark
                        ? "bg-green-500/10 border border-green-500/20 text-green-400"
                        : "bg-green-50 border border-green-200 text-green-700"
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">
                      Message sent successfully! I'll get back to you soon.
                    </p>
                  </motion.div>
                )}
                {sendSuccess === false && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-3 p-4 rounded-xl ${
                      isDark
                        ? "bg-red-500/10 border border-red-500/20 text-red-400"
                        : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                  >
                    <XCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">
                      Failed to send message. Please try again later.
                    </p>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
