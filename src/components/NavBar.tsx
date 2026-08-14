import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { PROFILE } from "../constants";

const navItems = [
  { id: "projects", label: "Work" },
  { id: "lab", label: "Lab" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

export const Navbar: React.FC = () => {
  const reduce = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setIsScrolled(window.scrollY > 24);
        const ids = ["home", ...navItems.map((i) => i.id)];
        // Last section whose top has passed the header line wins, so the
        // final section stays active at the bottom of the page.
        let current = ids[0];
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= 120) current = id;
        }
        setActiveSection(current);
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Lock scroll, close on Escape, and hand focus back to the trigger.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

  const linkClass = (id: string) =>
    `relative cursor-pointer py-1 text-sm transition-colors ${
      activeSection === id
        ? "text-ink"
        : "text-ink-muted hover:text-ink"
    }`;

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-colors duration-300 ${
        isScrolled
          ? "border-rule bg-paper/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6"
      >
        <ScrollLink
          to="home"
          href="#home"
          smooth={true}
          duration={500}
          className="-my-1 inline-flex cursor-pointer items-center py-1.5 font-mono text-sm tracking-tight text-ink"
        >
          {PROFILE.name}
        </ScrollLink>

        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => (
              <li key={item.id}>
                <ScrollLink
                  to={item.id}
                  href={`#${item.id}`}
                  smooth={true}
                  duration={500}
                  offset={-72}
                  aria-current={activeSection === item.id ? "true" : undefined}
                  className={linkClass(item.id)}
                >
                  {item.label}
                  {/* Underline, not colour alone, marks the active section. */}
                  {activeSection === item.id && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 left-0 h-px w-full bg-accent"
                    />
                  )}
                </ScrollLink>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-ink"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: reduce ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-rule bg-paper md:hidden"
          >
            <ul className="mx-auto w-full max-w-5xl px-6 py-2">
              {navItems.map((item) => (
                <li key={item.id} className="border-b border-rule last:border-0">
                  <ScrollLink
                    to={item.id}
                    href={`#${item.id}`}
                    smooth={true}
                    duration={500}
                    offset={-72}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={
                      activeSection === item.id ? "true" : undefined
                    }
                    className={`flex cursor-pointer items-center justify-between py-4 text-base ${
                      activeSection === item.id ? "text-accent" : "text-ink"
                    }`}
                  >
                    {item.label}
                    {activeSection === item.id && (
                      <span className="font-mono text-xs" aria-hidden="true">
                        current
                      </span>
                    )}
                  </ScrollLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
