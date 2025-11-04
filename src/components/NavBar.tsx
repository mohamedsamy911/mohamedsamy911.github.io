import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  readonly theme: string;
}
export const Navbar: React.FC<NavbarProps> = ({ theme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
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

  const navItems = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? theme === "dark"
            ? "bg-gray-900/90 backdrop-blur-md py-2 shadow-lg"
            : "bg-white/90 backdrop-blur-md py-2 shadow-lg"
          : "bg-transparent py-1"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center px-6">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold"
          >
            <ScrollLink
              href="#home"
              to="home"
              smooth={true}
              duration={500}
              className="cursor-pointer"
            >
              <img
                src={"/logo.webp"}
                alt="Mohamed Samy"
                className="w-15 h-15"
              />
            </ScrollLink>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <ScrollLink
                href={`#${item.id}`}
                key={item.id}
                to={item.id}
                smooth={true}
                duration={500}
                offset={-80}
                className={`relative px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${
                  activeSection === item.id
                    ? "text-indigo-500 dark:text-indigo-400"
                    : theme === "dark"
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onSetActive={() => setActiveSection(item.id)}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 top-full block h-0.5 w-full bg-indigo-500 dark:bg-indigo-400"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </ScrollLink>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <ThemeToggle className="md:hidden focus:outline-none" />
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className={`w-6 h-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-800"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className={`w-6 h-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-800"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`md:hidden overflow-hidden ${
                theme === "dark"
                  ? "bg-gradient-to-b from-gray-900 to-gray-800/95"
                  : "bg-gradient-to-b from-white to-gray-50/95"
              } backdrop-blur-xl border-t ${
                theme === "dark" ? "border-gray-700/50" : "border-gray-200/50"
              }`}
            >
              <div className="py-6 px-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ScrollLink
                      to={item.id}
                      smooth={true}
                      duration={500}
                      offset={-80}
                      className={`block px-6 py-4 text-lg font-semibold rounded-xl transition-all duration-200 ${
                        activeSection === item.id && theme === "dark"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50 transform scale-[1.02]"
                          : activeSection === item.id && theme === "light"
                          ? "bg-gradient-to-r from-indigo-400 to-purple-400 text-white shadow-lg shadow-indigo-400/50 transform scale-[1.02]"
                          : theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700/50 hover:text-white hover:translate-x-1"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:translate-x-1"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {activeSection === item.id && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </motion.svg>
                        )}
                      </div>
                    </ScrollLink>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
