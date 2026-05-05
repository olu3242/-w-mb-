"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, ShieldCheck, ArrowUpRight, TrendingUp } from "lucide-react";

const gifts = [
  {
    initials: "UB",
    name: "Uncle Bode",
    amount: "₦500,000",
    time: "2m ago",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    initials: "CC",
    name: "Cousins Club",
    amount: "₦1,200,000",
    time: "5m ago",
    gradient: "from-orange-400 to-pink-500",
  },
  {
    initials: "YF",
    name: "Yemi Friends",
    amount: "₦150,000",
    time: "12m ago",
    gradient: "from-zinc-600 to-zinc-800",
  },
  {
    initials: "AO",
    name: "Ade Okonkwo",
    amount: "₦750,000",
    time: "15m ago",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    initials: "NK",
    name: "Ngozi Kalu",
    amount: "₦300,000",
    time: "18m ago",
    gradient: "from-rose-500 to-red-600",
  },
  {
    initials: "SB",
    name: "Sola Brothers",
    amount: "₦2,000,000",
    time: "22m ago",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    initials: "DA",
    name: "Dayo & Abike",
    amount: "₦450,000",
    time: "30m ago",
    gradient: "from-purple-500 to-violet-700",
  },
];

export default function DigitalSprayingScene() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center px-6 py-10 md:px-12 bg-[#065F46] overflow-hidden"
    >
      {/* --- High-Energy Background Treatment --- */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.3, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 0.3 } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1600"
          alt="Money spraying tradition"
          className="w-full h-full object-cover grayscale mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#065F46] via-transparent to-[#065F46] opacity-60" />
      </div>

      <div className="container mx-auto relative z-10 grid lg:grid-cols-12 gap-16 items-center">
        {/* --- Content Column --- */}
        <div className="lg:col-span-7">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <h2 className="text-[12vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter text-white mb-10 uppercase">
              Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-100 to-white">
                Spraying.
              </span>
            </h2>

            <p className="text-lg md:text-xl font-medium text-emerald-50/70 max-w-xl leading-relaxed mb-12">
              Tradition meets transparency. No more missing envelopes or messy
              floor-sweeping. Let your guests spray joy instantly, with
              real-time feedback for the celebrants.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <Zap className="text-emerald-300" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">
                    Instant Joy
                  </h4>
                  <p className="text-xs text-emerald-100/60 leading-relaxed">
                    Push notifications let you feel every spray as it happens.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <ShieldCheck className="text-emerald-300" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">
                    Secure Ledger
                  </h4>
                  <p className="text-xs text-emerald-100/60 leading-relaxed">
                    Automated tracking ensures every gift is accounted for.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- Live Gift Wall Column --- */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative group"
          >
            {/* Ambient Glow */}
            <div className="absolute -inset-4 bg-emerald-400/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000" />

            <div className="relative bg-zinc-950/40 backdrop-blur-3xl border border-emerald-400 p-8 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[14px] font-black uppercase tracking-widest text-emerald-300">
                    Live Ledger
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-200 uppercase tracking-tighter">
                    Total Collected
                  </p>
                  <p className="text-2xl font-bold text-white tracking-tighter">
                    ₦4,240,000
                  </p>
                </div>
              </div>

              {/* Auto-scrolling Gift Feed */}
              <div className="relative h-[300px] overflow-hidden">
                {/* Fade masks */}
                {/* <div className="pointer-events-none absolute top-0 inset-x-0 h-12 z-10 bg-gradient-to-b from-zinc-950/60 to-transparent" />
                <div className="pointer-events-none absolute bottom-0 inset-x-0 h-12 z-10 bg-gradient-to-t from-zinc-950/60 to-transparent" /> */}

                <motion.div
                  className="p-4 space-y-4"
                  animate={{ y: ["0%", "-50%"] }}
                  transition={{
                    duration: 18,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                >
                  {[...gifts, ...gifts].map((g, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-xs bg-gradient-to-br ${g.gradient}`}
                      >
                        {g.initials}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-[10px] font-black uppercase text-slate-200 tracking-wide">
                            {g.name}
                          </p>
                          <span className="text-[10px] font-semibold text-slate-100 uppercase italic">
                            {g.time}
                          </span>
                        </div>
                        <p className="text-xl font-bold text-white tracking-tight leading-none">
                          {g.amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
              {/* CTA Footer */}
              <div className="p-8 bg-gradient-to-t from-zinc-900 to-transparent">
                <button className="group relative w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Spray Your Gift <ArrowUpRight size={16} />
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </button>
                <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400/50">
                  <TrendingUp size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">
                    Trending high in Lagos
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
