import { ArrowUpRight } from "lucide-react";
import { clientSystems, personalProjects } from "../constants";
import { Reveal, Section, SectionHeader } from "./Section";

/**
 * Selected work, ordered by weight rather than by what happens to be linkable.
 *
 * The public-sector and utility systems lead: they are the largest and by far
 * the rarest work here. The personal projects that used to occupy this space
 * are a compact index underneath, since they are smaller and, apart from the
 * Design Lab, cannot be inspected anyway.
 */
const ProjectsSection: React.FC = () => (
  <Section id="projects" labelledBy="projects-title">
    <SectionHeader
      index="01"
      label="Selected work"
      titleId="projects-title"
      title="Systems people depend on"
      lede="Most of what I have built runs inside governments and utilities: licensing, water and wastewater, asset tracking, public portals. It is client-owned, so none of it is linkable, which is the trade for working on things at that scale."
    />

    <ol className="mt-14 md:mt-16">
      {clientSystems.map((system, i) => (
        <li key={`${system.title}-${system.client}`}>
          <Reveal delay={Math.min(i, 3) * 0.05}>
            <article className="grid gap-x-10 gap-y-5 border-t border-rule py-10 md:grid-cols-[9rem_1fr] md:py-12">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent md:pt-2">
                {String(i + 1).padStart(2, "0")}
              </p>

              <div>
                <h3 className="text-2xl md:text-3xl">{system.title}</h3>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
                  {system.client}
                </p>

                <p className="mt-5 max-w-[64ch] leading-relaxed text-ink-muted">
                  {system.summary}
                </p>

                {system.outcome && (
                  <p className="mt-5 border-l-2 border-accent pl-4 text-sm text-ink">
                    {system.outcome}
                  </p>
                )}

                <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                  {system.stack.map((tech) => (
                    <li key={tech} className="font-mono text-xs text-ink-faint">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        </li>
      ))}
    </ol>

    <Reveal>
      <div className="grid gap-x-10 gap-y-8 border-t border-rule pt-10 md:grid-cols-[9rem_1fr]">
        <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint md:pt-1">
          Personal
        </h3>
        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {personalProjects.map((project) => (
            <li key={project.title}>
              <h4 className="text-base text-ink">{project.title}</h4>
              <p className="mt-1.5 max-w-[46ch] text-sm leading-relaxed text-ink-muted">
                {project.summary}
              </p>
              <p className="mt-2 font-mono text-xs text-ink-faint">
                {project.stack}
              </p>
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-3 inline-flex items-center gap-1.5 border-b border-rule-strong pb-0.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  View source
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                  <span className="sr-only"> for {project.title}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  </Section>
);

export default ProjectsSection;
