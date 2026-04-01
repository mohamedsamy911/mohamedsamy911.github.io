import { motion, useInView } from "framer-motion";
import React, { useEffect, useRef, useState, type JSX } from "react";
import { RESUME_CONTENT } from "../constants";
import resumePdfPath from "../assets/Mohamed_Samy_Resume.pdf";
import { useTheme } from "../context/ThemeContext";
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
  Briefcase,
  GraduationCap,
  MapPin,
  Download,
  TrendingUp,
  FolderKanban,
  CalendarDays,
  Award,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────── */

const experienceTimeline = [
  {
    role: "Senior Software Engineer",
    company: "Penta-b",
    period: "Jan 2022 — Present",
    location: "Egypt",
    highlights: [
      "Built and maintained scalable full-stack apps using React.js & NestJS/Java",
      "Designed RESTful APIs & microservices, improving response times by 40%",
      "Deployed services via Docker & Docker Swarm, reducing downtime by 30%",
      "Automated workflows with Camunda BPM, cutting manual processing by 50%",
    ],
  },
  {
    role: "GIS Developer",
    company: "Edge-Pro for Information Systems",
    period: "Jul 2020 — Jan 2022",
    location: "Egypt",
    highlights: [
      "Built web-based GIS dashboards with JavaScript, HTML & CSS",
      "Developed form workflows & notification systems for enhanced communication",
      "Conducted satellite image analysis & remote sensing for research projects",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "Freelance",
    period: "Ongoing",
    location: "Remote",
    highlights: [
      "E-commerce app with role-based auth (Next.js, PostgreSQL)",
      "Hospital Management System (React, NestJS, PostgreSQL, Redis)",
      "POS system using React Electron, NestJS & PostgreSQL",
    ],
  },
];

const education = [
  {
    degree: "Master of Business Administration",
    school: "Brooklyn Business School",
    period: "2024 — Present",
  },
  {
    degree: "Full Stack Web Development Diploma",
    school: "Route Academy",
    period: "2021 — 2022",
  },
  {
    degree: "B.Sc. Civil Engineering",
    school: "German University in Cairo (GUC)",
    period: "2013 — 2018",
  },
];

const stats = [
  { label: "Years Experience", value: 5, suffix: "+", icon: <CalendarDays className="w-5 h-5" /> },
  { label: "Projects Delivered", value: 10, suffix: "+", icon: <FolderKanban className="w-5 h-5" /> },
  { label: "Perf. Improvement", value: 40, suffix: "%", icon: <TrendingUp className="w-5 h-5" /> },
  { label: "Downtime Reduced", value: 30, suffix: "%", icon: <Award className="w-5 h-5" /> },
];

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

/* ─── Animated Counter ─────────────────────────────────────── */

const AnimatedCounter: React.FC<{
  value: number;
  suffix: string;
  duration?: number;
}> = ({ value, suffix, duration = 2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = value / (duration * 60); // ~60fps
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

/* ─── Section Tabs ─────────────────────────────────────────── */

type Tab = "skills" | "experience" | "education";

/* ─── Main Component ───────────────────────────────────────── */

const AboutSection: React.FC = () => {
  const { theme } = useTheme();
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.3 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("skills");

  useEffect(
    () => (isInView ? setHasAnimated(true) : setHasAnimated(false)),
    [isInView]
  );

  const professionalSummary =
    /PROFESSIONAL SUMMARY:([\s\S]*?)TECHNICAL SKILLS:/i
      .exec(RESUME_CONTENT)?.[1]
      .trim();

  const isDark = theme === "dark";

  const tabButtonClass = (tab: Tab) =>
    `px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
      activeTab === tab
        ? isDark
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
          : "bg-indigo-600 text-white shadow-lg shadow-indigo-400/30"
        : isDark
        ? "text-gray-400 hover:text-white hover:bg-gray-800"
        : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
    }`;

  return (
    <section
      id="about"
      className={`w-full py-24 px-4 transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-100"
      }`}
      aria-label="About Mohamed Samy - Software Engineer Skills and Experience"
    >
      <div className="container mx-auto max-w-6xl">
        {/* ── Header ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
              isDark
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                : "bg-indigo-100 text-indigo-700 border border-indigo-200"
            }`}
          >
            Get To Know Me
          </motion.span>
          <h2
            className={`text-4xl md:text-6xl font-bold mb-6 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            About{" "}
            <span className="text-indigo-600 dark:text-indigo-400">Me</span>
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto leading-relaxed ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
            itemProp="description"
          >
            {professionalSummary ||
              "Results-driven Software Engineer with extensive experience in building scalable, secure web applications."}
          </p>
        </motion.div>

        {/* ── Stats Row ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl p-6 text-center border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? "bg-gray-800/60 border-gray-700/50 hover:border-indigo-500/40"
                  : "bg-white/80 border-gray-200/60 hover:border-indigo-300 shadow-sm"
              }`}
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${
                  isDark ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-100 text-indigo-600"
                }`}
              >
                {stat.icon}
              </div>
              <div
                className={`text-3xl md:text-4xl font-bold mb-1 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div
                className={`text-xs md:text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Two-Column Content ───────────────────────────── */}
        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* LEFT — Tabs: Skills / Experience / Education */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            {/* Tab Buttons */}
            <div className="flex gap-2 mb-8 flex-wrap">
              <button className={tabButtonClass("skills")} onClick={() => setActiveTab("skills")}>
                Technical Skills
              </button>
              <button className={tabButtonClass("experience")} onClick={() => setActiveTab("experience")}>
                Experience
              </button>
              <button className={tabButtonClass("education")} onClick={() => setActiveTab("education")}>
                Education
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {/* ── Skills Tab ─────────────────────────────── */}
              {activeTab === "skills" && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.04 } },
                    }}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                  >
                    {keySkills.map((skill) => (
                      <motion.div
                        key={skill}
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        className={`flex items-center px-4 py-2.5 rounded-xl border gap-2.5 text-sm font-medium 
                        ${
                          isDark
                            ? "bg-indigo-500/10 text-indigo-200 border-indigo-600/40 hover:bg-indigo-600/20"
                            : "bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100"
                        } transition-all duration-200 hover:-translate-y-0.5 cursor-default`}
                      >
                        {skillIconMap[skill] || <BadgeInfo className="w-4 h-4" />}
                        {skill}
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Download Resume */}
                  <motion.a
                    href={resumePdfPath}
                    download="Mohamed_Samy_Resume.pdf"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`mt-8 inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl shadow-lg transition-all duration-300 gap-2
                      ${
                        isDark
                          ? "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/30"
                          : "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-400/40"
                      }
                    `}
                  >
                    <Download className="w-5 h-5" />
                    Download Resume
                  </motion.a>
                </motion.div>
              )}

              {/* ── Experience Tab ─────────────────────────── */}
              {activeTab === "experience" && (
                <motion.div
                  key="experience"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  {/* Timeline Line */}
                  <div
                    className={`absolute left-[15px] top-2 bottom-2 w-0.5 ${
                      isDark ? "bg-indigo-500/20" : "bg-indigo-200"
                    }`}
                  />

                  <div className="space-y-8">
                    {experienceTimeline.map((job, idx) => (
                      <motion.div
                        key={job.company}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="relative pl-10"
                      >
                        {/* Timeline Dot */}
                        <div
                          className={`absolute left-[9px] top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
                            idx === 0
                              ? isDark
                                ? "bg-indigo-500 border-indigo-400 shadow-lg shadow-indigo-500/40"
                                : "bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-400/40"
                              : isDark
                              ? "bg-gray-700 border-gray-600"
                              : "bg-gray-300 border-gray-400"
                          }`}
                        />

                        <div
                          className={`rounded-2xl p-5 border transition-all duration-300 ${
                            isDark
                              ? "bg-gray-800/50 border-gray-700/50 hover:border-indigo-500/30"
                              : "bg-white border-gray-200 hover:border-indigo-300 shadow-sm"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                            <h4
                              className={`text-lg font-bold ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {job.role}
                            </h4>
                            <span
                              className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${
                                isDark
                                  ? "bg-indigo-500/10 text-indigo-300"
                                  : "bg-indigo-100 text-indigo-700"
                              }`}
                            >
                              {job.period}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mb-3">
                            <span
                              className={`flex items-center gap-1.5 text-sm ${
                                isDark ? "text-indigo-400" : "text-indigo-600"
                              }`}
                            >
                              <Briefcase className="w-3.5 h-3.5" />
                              {job.company}
                            </span>
                            <span
                              className={`flex items-center gap-1 text-xs ${
                                isDark ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                          </div>
                          <ul className="space-y-1.5">
                            {job.highlights.map((h, i) => (
                              <li
                                key={i}
                                className={`text-sm leading-relaxed flex gap-2 ${
                                  isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                <span className="text-indigo-500 mt-1 shrink-0">▸</span>
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Education Tab ──────────────────────────── */}
              {activeTab === "education" && (
                <motion.div
                  key="education"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  {education.map((edu, idx) => (
                    <motion.div
                      key={edu.school}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className={`rounded-2xl p-5 border flex gap-4 items-start transition-all duration-300 ${
                        isDark
                          ? "bg-gray-800/50 border-gray-700/50 hover:border-indigo-500/30"
                          : "bg-white border-gray-200 hover:border-indigo-300 shadow-sm"
                      }`}
                    >
                      <div
                        className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
                          isDark
                            ? "bg-indigo-500/10 text-indigo-400"
                            : "bg-indigo-100 text-indigo-600"
                        }`}
                      >
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4
                          className={`text-base font-bold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {edu.degree}
                        </h4>
                        <p
                          className={`text-sm ${
                            isDark ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        >
                          {edu.school}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            isDark ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          {edu.period}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* RIGHT — Skills Progress Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
            ref={cardRef}
          >
            <div
              className={`rounded-3xl p-7 shadow-xl border backdrop-blur-xl transition-all duration-300 sticky top-24
              ${
                isDark
                  ? "bg-gradient-to-br from-indigo-900/30 to-indigo-600/10 border-indigo-600/20"
                  : "bg-gradient-to-br from-white to-indigo-50 border-indigo-200"
              }`}
            >
              <h3
                className={`text-2xl font-bold mb-6 tracking-tight ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Proficiency
              </h3>
              <div className="space-y-5">
                {experienceData.map((item, idx) => (
                  <div key={item.technology}>
                    <div className="flex justify-between mb-1.5">
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {item.technology}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          isDark ? "text-indigo-300" : "text-indigo-600"
                        }`}
                      >
                        {item.years}+ {item.years === 1 ? "year" : "years"}
                      </span>
                    </div>
                    <div
                      className={`w-full h-2 rounded-full overflow-hidden ${
                        isDark ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={
                          hasAnimated
                            ? { width: `${(item.years / 5) * 100}%` }
                            : { width: 0 }
                        }
                        transition={{ duration: 0.8, delay: idx * 0.08 }}
                        className={`h-full rounded-full ${
                          isDark
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                            : "bg-gradient-to-r from-indigo-500 to-indigo-600"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
