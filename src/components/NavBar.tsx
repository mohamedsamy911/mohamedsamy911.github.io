import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export const Navbar: React.FC = () => {
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ["home", "about", "projects", "contact"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? isDark
            ? "bg-gray-900/80 backdrop-blur-xl border-gray-800/50 shadow-lg shadow-black/10"
            : "bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-lg shadow-gray-200/30"
          : "bg-transparent border-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center px-6 md:px-10 h-18">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="shrink-0">
            <ScrollLink
              href="#home"
              to="home"
              smooth={true}
              duration={500}
              className="cursor-pointer flex items-center"
            >
              <img
                src={"/logo.webp"}
                alt="Mohamed Samy"
                className="w-14 h-14"
              />
            </ScrollLink>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <div
              className={`flex items-center gap-1 p-1 rounded-full ${
                isScrolled
                  ? isDark
                    ? "bg-gray-800/50"
                    : "bg-gray-100/50"
                  : ""
              }`}
            >
              {navItems.map((item) => (
                <ScrollLink
                  href={`#${item.id}`}
                  key={item.id}
                  to={item.id}
                  smooth={true}
                  duration={500}
                  offset={-80}
                  className={`relative px-4 py-2 text-sm font-medium cursor-pointer rounded-full transition-all duration-200 ${
                    activeSection === item.id
                      ? isDark
                        ? "text-white"
                        : "text-white"
                      : isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onSetActive={() => setActiveSection(item.id)}
                >
                  {activeSection === item.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className={`absolute inset-0 rounded-full ${
                        isDark
                          ? "bg-indigo-600"
                          : "bg-indigo-600"
                      }`}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </ScrollLink>
              ))}
            </div>
            <div className="ml-3">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile: Hamburger Only */}
          <button
            className={`md:hidden p-2 rounded-xl transition-colors cursor-pointer ${
              isDark
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 top-[72px] bg-black/20 backdrop-blur-sm md:hidden z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              {/* Drawer */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className={`md:hidden absolute left-4 right-4 top-[76px] rounded-2xl border z-50 overflow-hidden shadow-2xl ${
                  isDark
                    ? "bg-gray-900/95 border-gray-700/50 shadow-black/30 backdrop-blur-xl"
                    : "bg-white/95 border-gray-200/50 shadow-gray-300/30 backdrop-blur-xl"
                }`}
              >
                <div className="py-3 px-3 space-y-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06 }}
                    >
                      <ScrollLink
                        to={item.id}
                        smooth={true}
                        duration={500}
                        offset={-80}
                        className={`flex items-center justify-between px-4 py-3 text-base font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                          activeSection === item.id
                            ? isDark
                              ? "bg-indigo-600 text-white"
                              : "bg-indigo-600 text-white"
                            : isDark
                            ? "text-gray-300 hover:bg-gray-800/60"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{item.label}</span>
                        {activeSection === item.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-white"
                          />
                        )}
                      </ScrollLink>
                    </motion.div>
                  ))}
                </div>

                {/* Divider + Theme Toggle inside drawer */}
                <div
                  className={`px-4 py-3 border-t flex items-center justify-between ${
                    isDark ? "border-gray-800" : "border-gray-100"
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Appearance
                  </span>
                  <ThemeToggle />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
