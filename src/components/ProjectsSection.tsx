import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import GlareHover from "./GlareHover";
import { projects } from "../constants";
import { useTheme } from "../context/ThemeContext";

const ProjectsSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="projects"
      className={`min-h-screen w-full py-24 px-4 relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800"
          : "bg-gradient-to-b from-gray-50 via-white to-gray-50"
      }`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            isDark ? "bg-indigo-600" : "bg-indigo-300"
          }`}
        />
        <div
          className={`absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            isDark ? "bg-purple-600" : "bg-purple-300"
          }`}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block"
            >
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
                  isDark
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : "bg-indigo-100 text-indigo-700 border border-indigo-200"
                }`}
              >
                Portfolio Showcase
              </span>
            </motion.div>
            <h2
              className={`text-4xl md:text-6xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              My{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                Projects
              </span>
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Explore my latest work and creative solutions
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className={`rounded-3xl overflow-hidden backdrop-blur-sm transition-all duration-300 group relative flex flex-col ${
                  isDark
                    ? "bg-gray-800/80 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-indigo-500/20 border border-gray-700/50"
                    : "bg-white/80 shadow-lg hover:shadow-2xl hover:shadow-indigo-300/30 border border-gray-200/50"
                }`}
              >
                <GlareHover
                  glareColor="#ffffff"
                  glareOpacity={0.3}
                  glareAngle={-30}
                  glareSize={300}
                  transitionDuration={800}
                  playOnce={false}
                  className="h-full flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative h-52 w-full overflow-hidden shrink-0">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <img
                      src={project.pic}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md ${
                          project.category === "Backend"
                            ? isDark
                              ? "bg-emerald-500/80 text-white"
                              : "bg-emerald-100/90 text-emerald-800"
                            : project.category === "Frontend"
                            ? isDark
                              ? "bg-blue-500/80 text-white"
                              : "bg-blue-100/90 text-blue-800"
                            : isDark
                            ? "bg-indigo-500/80 text-white"
                            : "bg-white/90 text-indigo-700"
                        }`}
                      >
                        {project.category}
                      </span>
                    </div>

                    {/* Hover Action Overlay */}
                    {project.github && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-md transition-all duration-200 hover:scale-105 ${
                            isDark
                              ? "bg-white/15 text-white hover:bg-white/25 border border-white/20"
                              : "bg-white/90 text-gray-900 hover:bg-white shadow-lg"
                          }`}
                        >
                          <Github className="w-4 h-4" />
                          Source
                        </a>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-md transition-all duration-200 hover:scale-105 ${
                            isDark
                              ? "bg-indigo-600/80 text-white hover:bg-indigo-500/90 border border-indigo-400/30"
                              : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg"
                          }`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Demo
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className="p-7 flex flex-col flex-1"
                    itemScope
                    itemType="https://schema.org/SoftwareSourceCode"
                  >
                    <h3
                      className={`text-xl font-bold mb-3 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                      itemProp="name"
                    >
                      {project.title}
                    </h3>
                    <p
                      className={`mb-5 text-sm leading-relaxed flex-1 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                      itemProp="description"
                    >
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(({ label, icon }, tagIndex) => (
                        <motion.span
                          key={label}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: index * 0.1 + tagIndex * 0.05,
                          }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.1 }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-200 cursor-default
                          ${
                            isDark
                              ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-300 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20"
                              : "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200/50"
                          }`}
                        >
                          {icon}
                          {label}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </GlareHover>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
