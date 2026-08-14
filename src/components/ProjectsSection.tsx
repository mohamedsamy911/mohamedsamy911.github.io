import { ArrowUpRight } from "lucide-react";
import { clientWork, projects } from "../constants";
import { Reveal, Section, SectionHeader } from "./Section";

const ProjectsSection: React.FC = () => (
  <Section id="projects" labelledBy="projects-title">
    <SectionHeader
      index="01"
      label="Selected work"
      titleId="projects-title"
      title="Things I have built and shipped"
      lede="Three systems in detail, then the client work I delivered at Penta-b and Edge-Pro. Most of it is client-owned and not public."
    />

    <ol className="mt-14 md:mt-16">
      {projects.map((project, i) => (
        <li key={project.title}>
          <Reveal delay={i * 0.06}>
            <article
              className="grid gap-x-10 gap-y-5 border-t border-rule py-10 md:grid-cols-[9rem_1fr] md:py-12"
              itemScope
              itemType="https://schema.org/SoftwareSourceCode"
            >
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint md:pt-2">
                <span className="text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* The index and year stack on desktop, but sit inline on
                    mobile, where they ran together as "012026" without a
                    separator. Matches the "01 / label" idiom in Section.tsx. */}
                <span className="mx-2 text-rule-strong md:hidden" aria-hidden="true">
                  /
                </span>
                <span className="md:mt-1 md:block">{project.period}</span>
              </p>

              <div>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="text-2xl md:text-3xl" itemProp="name">
                    {project.title}
                  </h3>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint">
                    {project.category}
                  </span>
                </div>

                <p
                  className="mt-4 max-w-[64ch] leading-relaxed text-ink-muted"
                  itemProp="description"
                >
                  {project.summary}
                </p>
                <p className="mt-3 max-w-[64ch] text-sm leading-relaxed text-ink-muted">
                  {project.detail}
                </p>

                {project.outcome && (
                  <p className="mt-5 border-l-2 border-accent pl-4 text-sm text-ink">
                    {project.outcome}
                  </p>
                )}

                <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="font-mono text-xs text-ink-faint"
                      itemProp="programmingLanguage"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-7 inline-flex items-center gap-2 border-b border-rule-strong pb-1 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                  >
                    View source
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                    <span className="sr-only"> for {project.title}</span>
                  </a>
                )}
              </div>
            </article>
          </Reveal>
        </li>
      ))}
    </ol>

    {/* Client work: real, substantial, and not linkable, so it is listed as
        an index rather than padded out into portfolio cards. */}
    <Reveal>
      <div className="grid gap-x-10 gap-y-6 border-t border-rule pt-10 md:grid-cols-[9rem_1fr]">
        <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint md:pt-1">
          Also shipped
        </h3>
        <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {clientWork.map((item) => (
            <li key={`${item.title}-${item.client}`}>
              <p className="text-sm font-medium text-ink">{item.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{item.client}</p>
              <p className="mt-1.5 font-mono text-xs text-ink-faint">
                {item.stack}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  </Section>
);

export default ProjectsSection;
