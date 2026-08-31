/**
 * Small motion primitives for the ABox redesign. Wraps `motion/react`
 * with defaults that respect `prefers-reduced-motion` and keep the
 * editorial rhythm consistent (short, low amplitude, spring-eased).
 */
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

const rise: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.2, 0.7, 0.2, 1] } },
};

export function FadeRise({
  children,
  delay = 0,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "header";
}) {
  const reduce = useReducedMotion();
  const MotionEl = motion[As] as typeof motion.div;
  if (reduce) return <As className={className}>{children}</As>;
  return (
    <MotionEl
      className={className}
      initial="hidden"
      animate="show"
      variants={rise}
      transition={{ delay }}
    >
      {children}
    </MotionEl>
  );
}

export function Stagger({ children, className, delay = 0.05 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={rise}>
      {children}
    </motion.div>
  );
}

/** Animated number count-up for KPI cards. */
export function CountUp({ value, duration = 900, format = (v: number) => v.toLocaleString() }: { value: number; duration?: number; format?: (v: number) => string }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);
  useEffect(() => {
    if (reduce) { setN(value); return; }
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduce]);
  return <>{format(n)}</>;
}
