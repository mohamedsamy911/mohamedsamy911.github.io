import "./App.css";
import HeroSection from "./components/HeroSection";
import { Navbar } from "./components/NavBar";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import ProjectsSection from "./components/ProjectsSection";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import AIChat from "./components/AIChat";
import Footer from "./components/Footer";
import { useEffect } from "react";

function App() {
  return (
    <ThemeProvider>
      <PortfolioContent />
    </ThemeProvider>
  );
}

function PortfolioContent() {
  const { theme } = useTheme();
  useEffect(() => {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      if (theme === "dark") {
        themeColorMeta.setAttribute("content", "oklch(21% 0.034 264.665)");
      } else {
        themeColorMeta.setAttribute("content", "#E6EDFF");
      }
    }
  }, [theme]);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <ContactSection />
      <AIChat />
      <Footer />
    </div>
  );
}

export default App;
