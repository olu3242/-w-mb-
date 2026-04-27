// ─── components/owambe/DigitalSprayingScene.tsx ─────────────
// "use client";
// import { motion } from "framer-motion";
// import { useInView } from "framer-motion";
// import { useRef } from "react";
// import { Zap, ShieldCheck } from "lucide-react";

// const gifts = [
//   {
//     initials: "UB",
//     name: "Uncle Bode",
//     amount: "₦500,000",
//     time: "2m ago",
//     color: "#065F46",
//   },
//   {
//     initials: "CC",
//     name: "Cousins Club",
//     amount: "₦1,200,000",
//     time: "5m ago",
//     color: "#FF7F50",
//   },
//   {
//     initials: "YF",
//     name: "Yemi Friends",
//     amount: "₦150,000",
//     time: "12m ago",
//     color: "#1A1A1A",
//   },
// ];

// export default function DigitalSprayingScene() {
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: "-100px" });

//   return (
//     <section
//       ref={ref}
//       className="relative min-h-[80vh] flex items-center px-6 md:px-12 bg-[#065F46] overflow-hidden"
//     >
//       <img
//         src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1600"
//         alt="Action money spraying"
//         className="absolute inset-0 w-full h-full object-cover opacity-20"
//         style={{ filter: "saturate(1.2) contrast(1.1)", zIndex: 0 }}
//       />

//       <div className="relative z-10 w-full grid md:grid-cols-2 items-center gap-20">
//         <motion.div
//           className="text-white"
//           initial={{ opacity: 0, x: -50 }}
//           animate={isInView ? { opacity: 1, x: 0 } : {}}
//           transition={{ duration: 0.7 }}
//         >
//           <h2
//             className="font-black uppercase text-6xl md:text-[8vw] leading-none"
//             style={{ lineHeight: 0.85, letterSpacing: "-0.04em" }}
//           >
//             Digital <br /> <span className="text-[#FACC15]">Spraying.</span>
//           </h2>
//           <p className="text-2xl font-bold mt-10 max-w-xl">
//             The tradition is communal, but the cash is messy. We've digitized
//             spraying. Guests contribute instantly via link, and the celebrants
//             see the joy in real-time.
//           </p>
//           <div className="mt-12 space-y-6">
//             <div className="flex items-center gap-6">
//               <div className="w-16 h-16 bg-white/10 flex items-center justify-center rounded-2xl border border-[#1A1A1A]">
//                 <Zap className="w-7 h-7 text-[#FACC15]" />
//               </div>
//               <p className="font-bold">
//                 Instant notification for the celebrant.
//               </p>
//             </div>
//             <div className="flex items-center gap-6">
//               <div className="w-16 h-16 bg-white/10 flex items-center justify-center rounded-2xl border border-[#1A1A1A]">
//                 <ShieldCheck className="w-7 h-7 text-[#FF7F50]" />
//               </div>
//               <p className="font-bold">
//                 No more lost envelopes or missing cash.
//               </p>
//             </div>
//           </div>
//         </motion.div>

//         <motion.div
//           className="overflow-hidden text-[#1A1A1A]"
//           style={{
//             border: "1px solid #1A1A1A",
//             boxShadow: "10px 10px 0px #1A1A1A",
//             background: "white",
//           }}
//           initial={{ opacity: 0, x: 50 }}
//           animate={isInView ? { opacity: 1, x: 0 } : {}}
//           transition={{ duration: 0.7, delay: 0.2 }}
//         >
//           <div className="bg-[#1A1A1A] text-[#FACC15] p-4 flex justify-between items-center">
//             <span className="text-[10px] font-black uppercase tracking-widest">
//               Live Gift Wall
//             </span>
//             <span className="font-serif italic font-black text-xl">
//               Total: ₦4,240,000
//             </span>
//           </div>
//           <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
//             {gifts.map((g, i) => (
//               <div
//                 key={i}
//                 className="flex items-center gap-4 bg-slate-50 p-3 border border-[#1A1A1A]"
//               >
//                 <div
//                   className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-xs flex-shrink-0"
//                   style={{ backgroundColor: g.color }}
//                 >
//                   {g.initials}
//                 </div>
//                 <div>
//                   <p className="text-xs font-black uppercase">{g.name}</p>
//                   <p className="text-lg font-serif italic font-black text-[#065F46]">
//                     {g.amount}
//                   </p>
//                 </div>
//                 <span className="ml-auto text-[8px] font-black uppercase opacity-40">
//                   {g.time}
//                 </span>
//               </div>
//             ))}
//           </div>
//           <div className="p-6 bg-[#FACC15]/10">
//             <button className="w-full bg-[#1A1A1A] text-[#FACC15] py-4 font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform">
//               Spray Your Gift
//             </button>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

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

            <div className="relative bg-zinc-950/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
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

              {/* Gift Feed */}
              <div className="p-6 space-y-4 max-h-[360px] overflow-y-auto scrollbar-hide">
                {gifts.map((g, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl transition-colors hover:bg-white/10"
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
                  </motion.div>
                ))}
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
