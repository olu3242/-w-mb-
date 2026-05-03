// ─── components/owambe/StackSection.tsx ───────────────────
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function StackSection({
  children,
  index,
  total,
}: {
  children: React.ReactNode;
  index: number;
  total: number;
}) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.6]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], [0, 24]);

  const isLast = index === total - 1;

  return (
    <div
      ref={ref}
      className="sticky top-0 h-screen overflow-hidden"
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        className="w-full h-full origin-top"
        style={!isLast ? { scale, opacity, borderRadius } : {}}
      >
        {children}
      </motion.div>
    </div>
  );
}
