import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { ArrowUpRight, Loader2 } from "lucide-react";
import {
  PROFILE,
  PUBLIC_KEY,
  SERVICE_ID,
  TEMPLATE_ID,
} from "../constants";
import { Reveal, Section, SectionHeader } from "./Section";

const details = [
  { label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}` },
  { label: "Phone", value: PROFILE.phone, href: PROFILE.phoneHref },
  { label: "Location", value: PROFILE.location, href: null },
];

const socials = [
  { name: "GitHub", link: PROFILE.github },
  { name: "LinkedIn", link: PROFILE.linkedin },
];

const fieldClass =
  "w-full rounded-sm border border-rule-strong bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-accent";

const labelClass =
  "block font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint";

const ContactSection: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<boolean | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendSuccess(null);

    if (!PUBLIC_KEY || !TEMPLATE_ID || !form.current) {
      console.error("EmailJS is not configured.");
      setSendSuccess(false);
      setIsSending(false);
      return;
    }

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then(
        () => {
          setSendSuccess(true);
          form.current?.reset();
        },
        (error) => {
          console.error("Failed to send email:", error?.text ?? error);
          setSendSuccess(false);
        }
      )
      .finally(() => setIsSending(false));
  };

  return (
    <Section id="contact" labelledBy="contact-title">
      <div itemScope itemType="https://schema.org/ContactPage">
        <SectionHeader
          index="05"
          label="Contact"
          titleId="contact-title"
          title="Tell me what you are building"
          lede="Available for full-time roles and freelance contracts. If it involves React, NestJS or the infrastructure underneath them, I would like to hear about it."
        />

        <div className="mt-14 grid gap-x-10 gap-y-12 border-t border-rule pt-10 md:mt-16 md:grid-cols-[9rem_1fr]">
          <div className="space-y-10">
            <dl className="space-y-5">
              {details.map((item) => (
                <div key={item.label}>
                  <dt className={labelClass}>{item.label}</dt>
                  <dd className="mt-1.5 text-sm">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="border-b border-rule text-ink transition-colors hover:border-accent hover:text-accent"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-ink">{item.value}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div>
              <p className={labelClass}>Elsewhere</p>
              <ul className="mt-2.5 space-y-2">
                {socials.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-sm text-ink transition-colors hover:text-accent"
                    >
                      {s.name}
                      <ArrowUpRight
                        className="h-3.5 w-3.5 text-ink-faint transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Reveal>
            <form ref={form} onSubmit={handleSubmit} className="max-w-xl">
              <p className="text-sm text-ink-muted">
                Every field is required.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Your name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="user_name"
                    autoComplete="name"
                    placeholder="Jane Okafor"
                    className={`${fieldClass} mt-2`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="user_email"
                    autoComplete="email"
                    placeholder="jane@company.com"
                    className={`${fieldClass} mt-2`}
                    required
                  />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="message" className={labelClass}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="What are you building, and where are you stuck?"
                  className={`${fieldClass} mt-2 resize-y`}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                aria-busy={isSending}
                className="mt-7 inline-flex items-center justify-center gap-2.5 rounded-sm bg-accent px-6 py-3.5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSending && (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                )}
                {isSending ? "Sending" : "Send message"}
              </button>

              {/* Announced to screen readers; never colour-only. */}
              <div role="status" aria-live="polite" className="mt-5">
                {sendSuccess === true && (
                  <p className="border-l-2 border-ok pl-4 text-sm text-ink">
                    <strong className="font-semibold">Sent.</strong> Thanks, I
                    will get back to you shortly.
                  </p>
                )}
                {sendSuccess === false && (
                  <p className="border-l-2 border-err pl-4 text-sm text-ink">
                    <strong className="font-semibold">Not sent.</strong> The
                    message did not go through. Email me directly at{" "}
                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="border-b border-rule-strong hover:border-accent hover:text-accent"
                    >
                      {PROFILE.email}
                    </a>
                    .
                  </p>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </Section>
  );
};

export default ContactSection;
