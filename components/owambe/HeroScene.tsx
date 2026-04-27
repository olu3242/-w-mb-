"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Users, Wallet } from "lucide-react";

export default function HeroScene() {
  // Animation variants for staggered reveal
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  };
  return (
    <section className="relative min-h-screen flex items-center px-6 pt-40 pb-20 md:px-12 overflow-hidden bg-[#0a0a0a] font-poppins">
      {/* --- High-End Background Treatment --- */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1600"
          alt="Luxury Event"
          className="w-full h-full object-cover"
        />
        {/* Deep cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="container mx-auto relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        {/* --- Text Content (Left Column) --- */}
        <div className="lg:col-span-8">
          <motion.div {...fadeInUp}>
            <h1 className="text-[14vw] md:text-[8.5vw] font-black leading-[0.85] tracking-tighter text-white mb-8">
              THE PARTY <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                IS A SYSTEM.
              </span>
            </h1>

            <p className="text-lg md:text-xl font-medium text-zinc-400 max-w-xl leading-relaxed mb-12">
              Nigerian celebrations are a force of nature. We provide the
              architectural precision to manage the chaos, so you can focus on
              the soul of the event.
            </p>

            <div className="flex flex-wrap gap-6">
              <button className="group flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest transition-all">
                Plan My Owambe
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest transition-all">
                <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                  <Play size={12} className="text-green-400 fill-green-400" />
                </div>
                How it works
              </button>
            </div>
          </motion.div>
        </div>

        {/* --- Interactive Glass Card (Right Column) --- */}
        <div className="lg:col-span-4 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative group"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />

            <div className="relative bg-zinc-900/40 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl">
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Live Metric
                  </p>
                  <p className="text-white font-bold">Lagos Gala 2026</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
              </div>

              <div className="space-y-8">
                <div className="flex items-end justify-between">
                  <div>
                    <h4 className="text-5xl font-black text-white tracking-tighter">
                      742
                    </h4>
                    <p className="text-[10px] font-bold uppercase text-zinc-500 flex items-center gap-2 mt-2">
                      <Users size={12} className="text-green-500" /> Guests In
                    </p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-2xl font-black text-green-400">
                      ₦4.2M
                    </h4>
                    <p className="text-[10px] font-bold uppercase text-zinc-500 flex items-center gap-2 justify-end mt-2">
                      <Wallet size={12} className="text-green-500" /> Sprayed
                    </p>
                  </div>
                </div>

                {/* Custom Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400">
                    <span>Capacity</span>
                    <span>85%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 2, delay: 1 }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-lg font-bold text-white">12</p>
                    <p className="text-[8px] font-black uppercase text-zinc-500">
                      Vendors
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-lg font-bold text-white">98%</p>
                    <p className="text-[8px] font-black uppercase text-zinc-500">
                      Aso-Ebi Dist.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-green-500 to-transparent" />
      </motion.div>
    </section>
  );
}
