import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { Github, Linkedin, Mail, Heart, ArrowUp } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
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
    href: "https://www.linkedin.com/in/mohamedsamy911/",
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
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Top divider line */}
      <div
        className={`h-px ${
          isDark
            ? "bg-gradient-to-r from-transparent via-gray-700 to-transparent"
            : "bg-gradient-to-r from-transparent via-gray-300 to-transparent"
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
                alt="Mohamed Samy"
                className="w-12 h-12 mx-auto md:mx-0 mb-3"
              />
            </ScrollLink>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-gray-400" : "text-gray-500"
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
                isDark ? "text-gray-500" : "text-gray-400"
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
                    ? "text-gray-400 hover:text-indigo-400"
                    : "text-gray-500 hover:text-indigo-600"
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
                isDark ? "text-gray-500" : "text-gray-400"
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
                      ? "bg-gray-800 text-gray-400 hover:bg-indigo-600 hover:text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-indigo-600 hover:text-white"
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
              ? "bg-gradient-to-r from-transparent via-gray-800 to-transparent"
              : "bg-gradient-to-r from-transparent via-gray-200 to-transparent"
          }`}
        />

        {/* Bottom Row: Copyright + Back to top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className={`text-sm flex items-center gap-1.5 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            © {year} Mohamed Samy. Made with
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            All rights reserved.
          </p>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
            <ScrollLink
              to="home"
              smooth={true}
              duration={800}
              className={`flex items-center gap-2 text-sm font-medium cursor-pointer px-4 py-2 rounded-full transition-all duration-200 ${
                isDark
                  ? "text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700"
                  : "text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200"
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
