import HeroSection from "./components/HeroSection";
import { Navbar } from "./components/NavBar";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import ContactSection from "./components/ContactSection";
import ProjectsSection from "./components/ProjectsSection";
import DesignLab from "./components/DesignLab";
import { ThemeProvider } from "./context/ThemeContext";
import Footer from "./components/Footer";
import StructuredData from "./components/StructuredData";
import ConsentBanner from "./components/ConsentBanner";

function App() {
  return (
    <ThemeProvider>
      <StructuredData />

      {/* First tab stop: lets keyboard users jump the header (WCAG 2.4.1). */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-accent-ink"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        <HeroSection />
        <ProjectsSection />
        <DesignLab />
        <AboutSection />
        <ServicesSection />
        <ContactSection />
      </main>

      <Footer />
      <ConsentBanner />
    </ThemeProvider>
  );
}

export default App;
