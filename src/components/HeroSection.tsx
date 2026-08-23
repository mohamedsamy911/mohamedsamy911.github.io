import { Link as ScrollLink } from "react-scroll";
import { ArrowDown, ArrowRight } from "lucide-react";
import { PROFILE } from "../constants";
import resumePdfPath from "../assets/Mohamed_Samy_Resume.pdf";

const facts = [
  { label: "Currently", value: "NCEC environmental platform, Penta-b" },
  { label: "Based in", value: PROFILE.location },
  { label: "Working in", value: "React · NestJS · Kafka · Docker Swarm · RHEL" },
];

/**
 * The hero renders immediately, with no entrance animation.
 *
 * It used to fade in with a staggered `opacity: 0 -> 1`. The page is
 * prerendered, but React discards that DOM on boot and remounts at opacity 0,
 * so the already-painted content vanished and faded back. Measured on a
 * 4x-throttled phone: every resource was on the wire by 437ms and first paint
 * landed at 1512ms, but LCP was not recorded until 4856ms -- the whole 3.3s gap
 * was the fade. Below-fold sections still animate on scroll, where it costs
 * nothing.
 */
const HeroSection: React.FC = () => {
  return (
    <section id="home" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="grid items-start gap-12 md:grid-cols-[1fr_auto] md:gap-16">
          <div>
            <p
              className="font-mono text-xs uppercase tracking-[0.2em] text-accent"
            >
              {PROFILE.role}
            </p>

            <h1
              className="mt-5 text-[clamp(2.75rem,9vw,5.5rem)] leading-[0.95] tracking-[-0.03em]"
            >
              {PROFILE.name}
            </h1>

            <p
              className="mt-7 max-w-[54ch] text-lg leading-relaxed text-ink-muted sm:text-xl"
            >
              I build web systems and keep them running. Seven years of
              production work for governments and utilities across Saudi
              Arabia, Oman and Egypt, from the React front end down to the
              Linux hosts and the database failover.
            </p>

            <div
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
            </div>
          </div>

          {/* Plain, framed portrait. No tilt, no glare, no fake status dot. */}
          <div className="order-first md:order-last">
            {/* Pre-cropped and pre-desaturated at 2x display size by
                scripts/generate_brand_assets.mjs. The full-size source was the
                measured LCP element on mobile: 1.35MP decoded into a 224x280
                slot, with a grayscale filter over the whole bitmap. */}
            <img
              src="/me-hero.webp"
              alt={`${PROFILE.name}, ${PROFILE.role}`}
              width={224}
              height={280}
              fetchPriority="high"
              decoding="async"
              className="h-[280px] w-[224px] border border-rule object-cover object-top"
            />
          </div>
        </div>

        {/* Facts strip: the substance the old build put in a glass card. */}
        <dl
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
        </dl>
      </div>
    </section>
  );
};

export default HeroSection;
