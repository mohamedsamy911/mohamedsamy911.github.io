import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Link as ScrollLink } from "react-scroll";
import grainUrl from "../assets/grain.webp";
import iconUrl from "../assets/iconpattern.png";
import ProfileCard from "./ProfileCard";
import TextType from "./TextType";
import TrueFocus from "./TrueFocus";
interface HeroSectionProps {
  readonly theme: string;
}
const HeroSection: React.FC<HeroSectionProps> = ({ theme }) => {
  const [hovered, setHovered] = useState(false);
  const subtitles = useRef([
    "JavaScript Developer",
    "Full Stack Engineer",
    "React Specialist",
    "Tech Enthusiast",
  ]);

  return (
    <section
      id="home"
      className={`relative min-h-screen w-full overflow-hidden flex flex-col justify-around ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              theme === "dark" ? "bg-indigo-500/10" : "bg-indigo-400/20"
            }`}
            initial={{
              x: Math.random() * window.innerWidth - window.innerWidth / 3,
              y: Math.random() * window.innerHeight - window.innerHeight / 3,
            }}
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
            }}
            animate={{
              x: [null, Math.random() * 100 - 50 + "vw"],
              y: [null, Math.random() * 100 - 50 + "vh"],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div 
        className="relative z-10 flex h-full w-full flex-col-reverse md:flex-row-reverse items-center justify-around gap-8 px-4 text-center md:text-left mt-[5rem]"
        itemScope 
        itemType="https://schema.org/Person"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <ProfileCard
            name="Mohamed Samy"
            title="Software Engineer"
            handle="mohamedsamy911"
            grainUrl={grainUrl}
            iconUrl={iconUrl}
            showBehindGradient={true}
            innerGradient="linear-gradient(145deg,#60496e8c 0%,#4b596344 100%)"
            status="Online"
            contactText="Contact Me"
            avatarUrl="/me.webp"
            showUserInfo={true}
            enableTilt={true}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.h1
            className={`mb-6 text-5xl font-bold md:text-7xl ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.span
              className="block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Hello, I'm{" "}
              <span className="text-indigo-600 dark:text-indigo-400" itemProp="name">
                <TrueFocus
                  sentence="Mohamed Samy"
                  manualMode={false}
                  blurAmount={5}
                  borderColor={theme == "dark" ? "#E4ECFF" : "#615FFF"}
                  animationDuration={2}
                  pauseBetweenAnimations={1}
                />
              </span>
            </motion.span>
          </motion.h1>

          {/* Typing subtitle */}
          <motion.div
            className={`mb-8 text-xl md:text-2xl min-h-[2.5rem] flex justify-center md:justify-start ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
            initial={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            itemProp="jobTitle"
          >
            <motion.span
              id="typing-text"
              className="inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <TextType
                text={subtitles.current}
                textColors={
                  theme === "dark"
                    ? ["#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"]
                    : ["#4f46e5", "#4338ca", "#3730a3", "#312e81"]
                }
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
              />
            </motion.span>
            {/* Text will be inserted by JS */}
          </motion.div>

          {/* Animated CTA button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <ScrollLink
              to="projects"
              href="#projects"
              smooth={true}
              duration={500}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className={`relative inline-flex items-center overflow-hidden rounded-full px-8 py-4 text-lg font-medium transition-all ${
                theme === "dark"
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30"
                  : "bg-indigo-500 text-white hover:bg-indigo-600 hover:shadow-indigo-400/30"
              } hover:shadow-lg`}
            >
              <motion.span
                animate={{
                  x: hovered ? 5 : 0,
                  transition: { type: "spring", stiffness: 500 },
                }}
              >
                View My Work
              </motion.span>
              <motion.svg
                animate={{
                  x: hovered ? 10 : 5,
                  opacity: hovered ? 1 : 0.7,
                }}
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </motion.svg>

              {/* Button hover effect */}
              <motion.span
                className={`absolute inset-0 rounded-full ${
                  theme === "dark" ? "bg-white/10" : "bg-white/20"
                }`}
                initial={{ scale: 0 }}
                animate={{
                  scale: hovered ? 1.2 : 0,
                  opacity: hovered ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </ScrollLink>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="translate-x-1/2 my-3 z-10"
      >
        <ScrollLink aria-label="Scroll to About Section" to="about" href="#about" smooth={true} duration={500}>
          <div
            className={`flex h-10 w-6 items-start justify-center rounded-full border-2 p-1 ${
              theme === "dark" ? "border-white/50" : "border-gray-700/50"
            }`}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className={`h-2 w-2 rounded-full ${
                theme === "dark" ? "bg-white" : "bg-gray-800"
              }`}
            />
          </div>
        </ScrollLink>
      </motion.div>
    </section>
  );
};
export default HeroSection;
