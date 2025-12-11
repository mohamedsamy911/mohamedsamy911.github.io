import { motion, useInView } from "framer-motion";
import React, { useEffect, useRef, useState, type JSX } from "react";
import { RESUME_CONTENT } from "../constants";
import resumePdfPath from "../assets/Resume 22025.pdf";
import {
  Code,
  Cable,
  Database,
  Link,
  MessageSquare,
  Puzzle,
  Server,
  Terminal,
  Code2,
  Container,
  Network,
  GitBranch,
  Clock,
  Github,
  BadgeInfo,
} from "lucide-react";

interface AboutSectionProps {
  readonly theme: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ theme }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.3 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(
    () => (isInView ? setHasAnimated(true) : setHasAnimated(false)),
    [isInView]
  );

  const professionalSummary =
    /PROFESSIONAL SUMMARY:([\s\S]*?)TECHNICAL SKILLS:/i
      .exec(RESUME_CONTENT)?.[1]
      .trim();

  const skillIconMap: Record<string, JSX.Element> = {
    "React.js": <Code className="w-4 h-4" />,
    NestJS: <Cable className="w-4 h-4" />,
    TypeScript: <Code2 className="w-4 h-4" />,
    Docker: <Container className="w-4 h-4" />,
    NGINX: <Server className="w-4 h-4" />,
    Linux: <Terminal className="w-4 h-4" />,
    PostgreSQL: <Database className="w-4 h-4" />,
    "RESTful APIs": <Link className="w-4 h-4" />,
    Microservices: <Network className="w-4 h-4" />,
    "CI/CD": <GitBranch className="w-4 h-4" />,
    "Agile Methodologies": <Clock className="w-4 h-4" />,
    "Problem Solving": <Puzzle className="w-4 h-4" />,
    Communication: <MessageSquare className="w-4 h-4" />,
    Github: <Github className="w-4 h-4" />,
  };

  const experienceData = [
    { technology: "React.js", years: 3 },
    { technology: "Node.js", years: 5 },
    { technology: "TypeScript", years: 3 },
    { technology: "Docker", years: 4 },
    { technology: "PostgreSQL", years: 5 },
    { technology: "REST APIs", years: 5 },
    { technology: "Microservices", years: 3 },
    { technology: "Java (Spring Boot)", years: 2 },
  ];

  const keySkills = [
    "React.js",
    "NestJS",
    "TypeScript",
    "Docker",
    "NGINX",
    "Linux",
    "PostgreSQL",
    "RESTful APIs",
    "Microservices",
    "CI/CD",
    "Agile Methodologies",
    "Problem Solving",
    "Communication",
    "Github",
  ];

  return (
    <section
      id="about"
      className={`min-h-screen w-full py-20 px-4 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
      aria-label="About Mohamed Samy - Software Engineer Skills and Experience"
    >
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center"
        >
          <h2
            className={`text-4xl md:text-5xl font-bold mb-8 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            About{" "}
            <span className="text-indigo-600 dark:text-indigo-400">Me</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Summary + Skills */}
            <div className="text-left">
              <p
                className={`text-lg mb-6 leading-relaxed ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
                itemProp="description"
              >
                {professionalSummary ||
                  "Results-driven Software Engineer with extensive experience in building scalable, secure web applications."}
              </p>

              {/* Skill Badges */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
                viewport={{ once: true }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8"
              >
                {keySkills.map((skill) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center px-4 py-2 rounded-lg shadow-sm border gap-2 text-sm font-medium 
        ${
          theme === "dark"
            ? "bg-indigo-500/10 text-indigo-200 border-indigo-600 hover:bg-indigo-600/20"
            : "bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-indigo-200"
        } transition-transform duration-200 hover:-translate-y-1`}
                  >
                    {skillIconMap[skill] || <BadgeInfo className="w-4 h-4" />}
                    {skill}
                  </motion.div>
                ))}
              </motion.div>

              {/* Download Button */}
              <motion.a
                href={resumePdfPath}
                download="Mohamed_Samy_Resume.pdf"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`mt-8 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg transition-all duration-300
                  ${
                    theme === "dark"
                      ? "bg-indigo-600 text-white hover:shadow-indigo-500/30"
                      : "bg-indigo-600 text-white hover:shadow-indigo-400/40"
                  }
                `}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download Resume
              </motion.a>
            </div>

            {/* Skills/Experience Card */}
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
              ref={cardRef}
            >
              <div
                className={`rounded-3xl p-8 shadow-xl border backdrop-blur-xl transition-all duration-300
        ${
          theme === "dark"
            ? "bg-gradient-to-br from-indigo-900/30 to-indigo-600/10 border-indigo-600/20"
            : "bg-gradient-to-br from-white to-indigo-100/50 border-indigo-200"
        }`}
              >
                <h3
                  className={`text-3xl font-semibold mb-6 tracking-tight ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  My Skills
                </h3>
                <div className="space-y-5">
                  {experienceData.map((item) => (
                    <div key={item.technology}>
                      <div className="flex justify-between mb-1">
                        <span
                          className={`text-sm font-medium ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {item.technology}
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            theme === "dark"
                              ? "text-indigo-300"
                              : "text-indigo-600"
                          }`}
                        >
                          {item.years}+ {item.years === 1 ? "year" : "years"}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={
                            hasAnimated
                              ? { width: `${(item.years / 5) * 100}%` }
                              : { width: 0 }
                          }
                          transition={{ duration: 0.7, delay: 0.1 }}
                          className={`h-full rounded-full ${
                            theme === "dark" ? "bg-indigo-500" : "bg-indigo-600"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
