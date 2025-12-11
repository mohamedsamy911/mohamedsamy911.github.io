import { motion } from "framer-motion";
import GlareHover from "./GlareHover";
import { projects } from "../constants";

interface ProjectsSectionProps {
  readonly theme: string;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ theme }) => {
  return (
    <section
      id="projects"
      className={`min-h-screen w-full py-24 px-4 relative overflow-hidden ${
        theme === "dark"
          ? "bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800"
          : "bg-gradient-to-b from-gray-50 via-white to-gray-50"
      }`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            theme === "dark" ? "bg-indigo-600" : "bg-indigo-300"
          }`}
        />
        <div
          className={`absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            theme === "dark" ? "bg-purple-600" : "bg-purple-300"
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
          {/* Enhanced Header */}
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
                  theme === "dark"
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : "bg-indigo-100 text-indigo-700 border border-indigo-200"
                }`}
              >
                Portfolio Showcase
              </span>
            </motion.div>
            <h2
              className={`text-4xl md:text-6xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              My{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                Projects
              </span>
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Explore my latest work and creative solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className={`rounded-3xl overflow-hidden backdrop-blur-sm transition-all duration-300 group relative ${
                  theme === "dark"
                    ? "bg-gray-800/80 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-indigo-500/20 border border-gray-700/50"
                    : "bg-white/80 shadow-lg hover:shadow-2xl hover:shadow-indigo-300/30 border border-gray-200/50"
                }`}
              >
                {/* Gradient Border Effect on Hover */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />

                <GlareHover
                  glareColor="#ffffff"
                  glareOpacity={0.3}
                  glareAngle={-30}
                  glareSize={300}
                  transitionDuration={800}
                  playOnce={false}
                  className="h-full"
                >
                  {/* Image Container with Overlay */}
                  <div className="relative h-52 w-full overflow-hidden">
                    <div
                      className={`absolute inset-0 z-10 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />
                    <img
                      src={project.pic}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                          theme === "dark"
                            ? "bg-indigo-500/80 text-white"
                            : "bg-white/90 text-indigo-700"
                        }`}
                      >
                        Featured
                      </span>
                    </div>
                  </div>

                  <div
                    className="p-7"
                    itemScope
                    itemType="https://schema.org/SoftwareSourceCode"
                  >
                    <h3
                      className={`text-xl font-bold mb-3 transition-all duration-300 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                      itemProp="name"
                    >
                      {project.title}
                    </h3>
                    <p
                      className={`mb-5 text-sm leading-relaxed ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                      itemProp="description"
                    >
                      {project.description}
                    </p>

                    {/* Enhanced Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(({ label, icon }, tagIndex) => (
                        <motion.span
                          key={label}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + tagIndex * 0.05 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.1 }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-200 cursor-default
                          ${
                            theme === "dark"
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
