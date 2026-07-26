import "./App.css";
import HeroSection from "./components/HeroSection";
import { Navbar } from "./components/NavBar";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import ContactSection from "./components/ContactSection";
import ProjectsSection from "./components/ProjectsSection";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import AIChat from "./components/AIChat";
import Footer from "./components/Footer";
import StructuredData from "./components/StructuredData";
import ConsentBanner from "./components/ConsentBanner";
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
    <div className="min-h-screen bg-white dark:bg-slate-900 dark:text-white transition-colors duration-300">
      <StructuredData />
      <Navbar />
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
      <AIChat />
      <Footer />
      <ConsentBanner />
    </div>
  );
}

export default App;
