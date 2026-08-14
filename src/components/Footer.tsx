import { Link as ScrollLink } from "react-scroll";
import { ArrowUp } from "lucide-react";
import { PROFILE } from "../constants";

const links = [
  { label: "GitHub", href: PROFILE.github, external: true },
  { label: "LinkedIn", href: PROFILE.linkedin, external: true },
  { label: "Email", href: `mailto:${PROFILE.email}`, external: false },
];

const Footer: React.FC = () => (
  <footer className="border-t border-rule">
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="grid gap-x-10 gap-y-8 md:grid-cols-[9rem_1fr]">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
          Colophon
        </p>

        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="max-w-[46ch] text-sm leading-relaxed text-ink-muted">
              Built with React, TypeScript and Tailwind. Set in Charter and the
              system mono. No trackers beyond opt-in analytics.
            </p>
            <p className="mt-4 font-mono text-xs text-ink-faint">
              © {new Date().getFullYear()} {PROFILE.name}
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="border-b border-rule text-sm text-ink-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <ScrollLink
              to="home"
              href="#home"
              smooth={true}
              duration={600}
              className="group inline-flex cursor-pointer items-center gap-2 py-1.5 text-sm text-ink-muted transition-colors hover:text-accent"
            >
              <ArrowUp
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              Back to top
            </ScrollLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
