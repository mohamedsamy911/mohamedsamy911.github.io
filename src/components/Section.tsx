import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Fade-and-rise on first view. Collapses to a plain fade when the visitor
 *  has asked for reduced motion. */
export const Reveal: React.FC<{
  children: ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

/** The page's one layout rhythm: a hairline rule, a mono index label in the
 *  left gutter, and content set against it. Replaces the centred
 *  "big heading + accent word + centred lede" template used by every
 *  section of the previous build. */
export const SectionHeader: React.FC<{
  index: string;
  label: string;
  title: string;
  titleId?: string;
  lede?: string;
}> = ({ index, label, title, titleId, lede }) => (
  <Reveal className="border-t border-rule pt-8 md:pt-10">
    <div className="grid gap-x-10 gap-y-4 md:grid-cols-[9rem_1fr]">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-faint md:pt-3">
        <span className="text-accent">{index}</span>
        <span className="mx-2 text-rule-strong" aria-hidden="true">
          /
        </span>
        <span className="md:block md:mx-0 md:mt-1">{label}</span>
      </p>
      <div>
        <h2
          id={titleId}
          className="text-3xl leading-[1.1] sm:text-4xl md:text-5xl"
        >
          {title}
        </h2>
        {lede && (
          <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-ink-muted sm:text-lg">
            {lede}
          </p>
        )}
      </div>
    </div>
  </Reveal>
);

export const Section: React.FC<{
  id: string;
  children: ReactNode;
  labelledBy?: string;
}> = ({ id, children, labelledBy }) => (
  <section id={id} aria-labelledby={labelledBy} className="scroll-mt-24">
    <div className="mx-auto w-full max-w-5xl px-6 py-20 md:py-28">{children}</div>
  </section>
);
