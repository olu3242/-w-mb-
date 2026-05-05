"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, XCircle, CheckCircle2 } from "lucide-react";

const oldWay = [
  "Lost fabric payments in WhatsApp threads",
  "Unreliable vendor arrival times",
  "Guest list inflation & 'plus-tens'",
  "Missing cash from the dance floor",
];

const newWay = [
  "Automated Aso-Ebi ledger and logistics",
  "Real-time vendor coordination dashboard",
  "QR-code secure guest check-in",
  "Secure digital spraying and instant payout",
];

export default function ComparisonSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#0a0a0a] overflow-hidden font-poppins"
    >
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* --- The Manual Chaos (Left) --- */}
          <div className="relative p-12 md:p-24  bg-white group overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none uppercase font-black text-[20rem] leading-none select-none tracking-tighter text-black">
              Chaos
            </div>

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative z-10"
            >
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-10">
                <XCircle size={14} /> The Manual Way
              </span>
              <h3 className="text-3xl md:text-5xl font-black uppercase leading-[0.85] tracking-tighter text-zinc-900 mb-16">
                Manual <span className="text-zinc-400">Chaos.</span>
              </h3>

              <div className="space-y-8">
                {oldWay.map((item, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="flex items-start gap-4 border-b border-zinc-100 pb-6 group/item"
                  >
                    <span className="text-[10px] font-black text-zinc-300 mt-1">
                      0{i + 1}
                    </span>
                    <p className="text-lg font-bold text-zinc-500 group-hover/item:text-red-500 transition-colors duration-300">
                      {item}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* --- The Systemic Joy (Right) --- */}
          <div className="relative p-12 md:p-24 bg-[#065F46] group overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none uppercase font-black text-[20rem] leading-none select-none tracking-tighter text-white">
              Soul
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1] as const,
                delay: 0.2,
              }}
              className="relative z-10"
            >
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-10">
                <CheckCircle2 size={14} /> The Owambe Way
              </span>
              <h3 className="text-3xl md:text-5xl font-black uppercase leading-[0.85] tracking-tighter text-white mb-16">
                Systemic <span className="text-emerald-400">Joy.</span>
              </h3>

              <div className="space-y-8">
                {newWay.map((item, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="flex items-start gap-4 border-b border-white/10 pb-6 group/item"
                  >
                    <span className="text-[10px] font-black text-emerald-500/50 mt-1">
                      0{i + 1}
                    </span>
                    <p className="text-lg font-bold text-emerald-50 group-hover/item:text-emerald-400 transition-colors duration-300">
                      {item}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ x: 10 }}
                className="mt-16 flex items-center gap-4 text-white text-[11px] font-black uppercase tracking-[0.3em] group"
              >
                Start planning with precision
                <div className="w-10 h-10 hidden md:flex rounded-full border border-white/20 items-center justify-center group-hover:bg-white group-hover:text-[#065F46] transition-all">
                  <ArrowRight size={16} />
                </div>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
