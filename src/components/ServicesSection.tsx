import { motion } from "framer-motion";
import { services } from "../constants";
import { useTheme } from "../context/ThemeContext";

const ServicesSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="services"
      className={`w-full py-24 px-4 transition-colors duration-300 ${
        isDark ? "bg-slate-900" : "bg-white"
      }`}
      aria-label="Services offered by Mohamed Samy"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
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
            What I{" "}
            <span className="text-blue-600 dark:text-blue-400">Do</span>
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            From the first line of UI to the container it ships in — here's how I
            can help.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className={`rounded-2xl p-6 border h-full flex flex-col transition-all duration-300 ${
                isDark
                  ? "bg-slate-800/50 border-slate-700/50 hover:border-blue-500/40"
                  : "bg-slate-50 border-slate-200 hover:border-blue-300 hover:shadow-lg shadow-sm"
              }`}
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                  isDark
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {service.icon}
              </div>
              <h3
                className={`text-lg font-bold mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {service.title}
              </h3>
              <p
                className={`text-sm leading-relaxed mb-4 flex-1 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {service.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {service.keywords.map((kw) => (
                  <span
                    key={kw}
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                      isDark
                        ? "bg-slate-700/50 text-slate-300"
                        : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
