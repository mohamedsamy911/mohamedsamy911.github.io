import { services } from "../constants";
import { Reveal, Section, SectionHeader } from "./Section";

const ServicesSection: React.FC = () => (
  <Section id="services" labelledBy="services-title">
    <SectionHeader
      index="04"
      label="Services"
      titleId="services-title"
      title="What I can take off your plate"
      lede="The work I do repeatedly and can be held to. The numbers are from systems currently in production, not projections."
    />

    <ol className="mt-14 md:mt-16">
      {services.map((service, i) => (
        <li key={service.title}>
          <Reveal delay={i * 0.05}>
            <article className="grid gap-x-10 gap-y-4 border-t border-rule py-10 md:grid-cols-[9rem_1fr]">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent md:pt-2">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div>
                <h3 className="text-xl md:text-2xl">{service.title}</h3>
                <p className="mt-4 max-w-[64ch] leading-relaxed text-ink-muted">
                  {service.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                  {service.keywords.map((kw) => (
                    <li key={kw} className="font-mono text-xs text-ink-faint">
                      {kw}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        </li>
      ))}
    </ol>
  </Section>
);

export default ServicesSection;
