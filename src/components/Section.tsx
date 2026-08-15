import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Fade-and-rise on first view.
 *
 * IntersectionObserver plus a CSS transition, rather than an animation library.
 * This was the last real consumer of framer-motion, and the effect is four
 * lines of platform API; the library was costing far more in bundle size than
 * the behaviour is worth. Honours reduced motion by showing immediately.
 */
export const Reveal: React.FC<{
  children: ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${shown ? " is-shown" : ""}${className ? ` ${className}` : ""}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
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
