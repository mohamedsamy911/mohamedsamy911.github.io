import { motion, useReducedMotion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { ArrowDown, ArrowRight } from "lucide-react";
import { PROFILE } from "../constants";
import resumePdfPath from "../assets/Mohamed_Samy_Resume.pdf";

const facts = [
  { label: "Currently", value: "Senior Software Engineer, Penta-b" },
  { label: "Based in", value: PROFILE.location },
  { label: "Working in", value: "React · NestJS · PostgreSQL · Docker" },
];

const HeroSection: React.FC = () => {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="home" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="grid items-start gap-12 md:grid-cols-[1fr_auto] md:gap-16">
          <div>
            <motion.p
              {...rise(0)}
              className="font-mono text-xs uppercase tracking-[0.2em] text-accent"
            >
              {PROFILE.role}
            </motion.p>

            <motion.h1
              {...rise(0.06)}
              className="mt-5 text-[clamp(2.75rem,9vw,5.5rem)] leading-[0.95] tracking-[-0.03em]"
            >
              {PROFILE.name}
            </motion.h1>

            <motion.p
              {...rise(0.12)}
              className="mt-7 max-w-[54ch] text-lg leading-relaxed text-ink-muted sm:text-xl"
            >
              I build web systems and keep them running. Five years of
              production work across government, utilities and private
              clients, from the React front end down to the containers and
              the reverse proxy.
            </motion.p>

            <motion.div
              {...rise(0.18)}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
            >
              <ScrollLink
                to="projects"
                href="#projects"
                smooth={true}
                duration={500}
                offset={-80}
                className="group inline-flex cursor-pointer items-center gap-2.5 rounded-sm bg-accent px-6 py-3.5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90"
              >
                Selected work
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </ScrollLink>

              <a
                href={resumePdfPath}
                download="Mohamed_Samy_Resume.pdf"
                className="group inline-flex items-center gap-2.5 border-b border-rule-strong pb-1 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Download résumé
                <ArrowDown
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </motion.div>
          </div>

          {/* Plain, framed portrait. No tilt, no glare, no fake status dot. */}
          <motion.div {...rise(0.24)} className="order-first md:order-last">
            <img
              src="/me.webp"
              alt={`${PROFILE.name}, ${PROFILE.role}`}
              width={224}
              height={280}
              fetchPriority="high"
              decoding="async"
              className="h-[280px] w-[224px] border border-rule object-cover object-top grayscale"
            />
          </motion.div>
        </div>

        {/* Facts strip: the substance the old build put in a glass card. */}
        <motion.dl
          {...rise(0.3)}
          className="mt-16 grid gap-px overflow-hidden border-t border-rule pt-8 sm:grid-cols-3"
        >
          {facts.map((f) => (
            <div key={f.label} className="py-1">
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint">
                {f.label}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink">
                {f.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
};

export default HeroSection;
