import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/mohamedsamy911",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mohamed-samy-ba0107141/",
    icon: Linkedin,
  },
  {
    label: "Email",
    href: "mailto:mohamedadel74@gmail.com",
    icon: Mail,
  },
];

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const year = new Date().getFullYear();

  return (
    <footer
      className={`relative overflow-hidden ${
        isDark ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Top divider line */}
      <div
        className={`h-px ${
          isDark
            ? "bg-gradient-to-r from-transparent via-slate-700 to-transparent"
            : "bg-gradient-to-r from-transparent via-slate-300 to-transparent"
        }`}
      />

      <div className="container mx-auto max-w-6xl px-6 py-14">
        {/* Top Row: Logo area + Nav + Socials */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 mb-10">
          {/* Branding */}
          <div className="text-center md:text-left max-w-xs">
            <ScrollLink
              to="home"
              smooth={true}
              duration={500}
              className="cursor-pointer"
            >
              <img
                src="/logo.webp"
                alt="Mohamed Samy logo"
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
                className="w-12 h-12 mx-auto md:mx-0 mb-3"
              />
            </ScrollLink>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Full Stack Engineer building scalable web apps with React, Node.js
              & NestJS.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <h4
              className={`text-xs font-semibold uppercase tracking-widest mb-2 ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Quick Links
            </h4>
            {navLinks.map((link) => (
              <ScrollLink
                key={link.id}
                to={link.id}
                smooth={true}
                duration={500}
                offset={-80}
                className={`text-sm cursor-pointer transition-colors duration-200 ${
                  isDark
                    ? "text-slate-400 hover:text-blue-400"
                    : "text-slate-500 hover:text-blue-600"
                }`}
              >
                {link.label}
              </ScrollLink>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h4
              className={`text-xs font-semibold uppercase tracking-widest mb-2 ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                    isDark
                      ? "bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div
          className={`h-px mb-6 ${
            isDark
              ? "bg-gradient-to-r from-transparent via-slate-800 to-transparent"
              : "bg-gradient-to-r from-transparent via-slate-200 to-transparent"
          }`}
        />

        {/* Bottom Row: Copyright + Back to top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className={`text-sm flex items-center gap-1.5 ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            © {year} Mohamed Samy. Made with ❤️ All rights reserved.
          </p>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
            <ScrollLink
              to="home"
              smooth={true}
              duration={800}
              className={`flex items-center gap-2 text-sm font-medium cursor-pointer px-4 py-2 rounded-full transition-all duration-200 ${
                isDark
                  ? "text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
                  : "text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200"
              }`}
            >
              <ArrowUp className="w-4 h-4" />
              Back to top
            </ScrollLink>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
