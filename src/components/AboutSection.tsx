import { ArrowDown } from "lucide-react";
import resumePdfPath from "../assets/Mohamed_Samy_Resume.pdf";
import { education, experienceTimeline, facts, skillGroups } from "../constants";
import { Reveal, Section, SectionHeader } from "./Section";

/** A labelled block in the section's left gutter, so the whole page keeps
 *  one alignment rhythm instead of alternating centred headings. */
const Block: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="grid gap-x-10 gap-y-5 border-t border-rule pt-10 md:grid-cols-[9rem_1fr]">
    <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint md:pt-1">
      {label}
    </h3>
    <div>{children}</div>
  </div>
);

const AboutSection: React.FC = () => (
  <Section id="about" labelledBy="about-title">
    <SectionHeader
      index="03"
      label="About"
      titleId="about-title"
      title="Five years of building for people who depend on it"
      lede="I work across the whole stack, but the part I care most about is what happens after launch: whether the thing stays up, stays fast, and stays understandable to whoever inherits it. Most of my work has been public-sector and utility systems where that matters more than the front page."
    />

    {/* Static figures. The previous build animated these counters on every
        scroll-past, so the visible number was usually the wrong one. */}
    <Reveal className="mt-14 md:mt-16">
      <dl className="grid grid-cols-2 gap-x-10 gap-y-8 border-t border-rule pt-10 md:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label}>
            <dt className="sr-only">{f.label}</dt>
            <dd>
              <span className="block font-display text-4xl leading-none tracking-[-0.02em] text-ink md:text-5xl">
                {f.value}
              </span>
              <span className="mt-3 block font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.14em] text-ink-faint">
                {f.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </Reveal>

    <Reveal className="mt-14">
      <Block label="Experience">
        <ol className="space-y-10">
          {experienceTimeline.map((job) => (
            <li key={`${job.company}-${job.role}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h4 className="text-xl">{job.role}</h4>
                <span className="font-mono text-xs text-ink-faint">
                  {job.period}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-accent">
                {job.company}
                <span className="mx-2 text-rule-strong" aria-hidden="true">
                  ·
                </span>
                <span className="text-ink-faint">{job.location}</span>
              </p>
              <ul className="mt-4 space-y-2">
                {job.highlights.map((h) => (
                  <li
                    key={h}
                    className="max-w-[64ch] text-sm leading-relaxed text-ink-muted before:mr-3 before:text-rule-strong before:content-['-']"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Block>
    </Reveal>

    <Reveal className="mt-14">
      <Block label="Toolkit">
        <dl className="space-y-6">
          {skillGroups.map((group) => (
            <div
              key={group.label}
              className="grid gap-x-8 gap-y-2 sm:grid-cols-[7rem_1fr]"
            >
              <dt className="text-sm text-ink-faint">{group.label}</dt>
              <dd className="flex flex-wrap gap-x-4 gap-y-2">
                {group.items.map((item) => (
                  <span key={item} className="font-mono text-sm text-ink">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Block>
    </Reveal>

    <Reveal className="mt-14">
      <Block label="Education">
        <ul className="space-y-6">
          {education.map((edu) => (
            <li
              key={edu.school}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
            >
              <div>
                <p className="text-base text-ink">{edu.degree}</p>
                <p className="mt-1 text-sm text-ink-muted">{edu.school}</p>
              </div>
              <span className="font-mono text-xs text-ink-faint">
                {edu.period}
              </span>
            </li>
          ))}
        </ul>

        <a
          href={resumePdfPath}
          download="Mohamed_Samy_Resume.pdf"
          className="group mt-10 inline-flex items-center gap-2.5 border-b border-rule-strong pb-1 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Download full résumé
          <ArrowDown
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
            aria-hidden="true"
          />
        </a>
      </Block>
    </Reveal>
  </Section>
);

export default AboutSection;
