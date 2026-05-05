"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  XCircle,
  Hourglass,
} from "lucide-react";

const asoEbiPeople = [
  {
    initials: "AT",
    name: "Aunty Titi",
    status: "Delivered",
    icon: <CheckCircle2 size={14} className="text-emerald-400" />,
    borderColor: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
  },
  {
    initials: "OO",
    name: "Ola Otunba",
    status: "Payment Pending",
    icon: <Clock size={14} className="text-amber-400" />,
    borderColor: "border-amber-500/20",
    bg: "bg-amber-500/5",
  },
  {
    initials: "BS",
    name: "Bode Smith",
    status: "Not Paid",
    icon: <AlertCircle size={14} className="text-zinc-400" />,
    borderColor: "border-white/10",
    bg: "bg-white/5",
  },
  {
    initials: "FK",
    name: "Funke Kuti",
    status: "Delivered",
    icon: <CheckCircle2 size={14} className="text-emerald-400" />,
    borderColor: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
  },
  {
    initials: "TJ",
    name: "Tunde Johnson",
    status: "Payment Pending",
    icon: <Clock size={14} className="text-amber-400" />,
    borderColor: "border-amber-500/20",
    bg: "bg-amber-500/5",
  },
  {
    initials: "AM",
    name: "Amaka Madu",
    status: "Not Paid",
    icon: <XCircle size={14} className="text-red-400" />,
    borderColor: "border-red-500/20",
    bg: "bg-red-500/5",
  },
  {
    initials: "CE",
    name: "Chidi Eze",
    status: "Tailoring",
    icon: <Hourglass size={14} className="text-blue-400" />,
    borderColor: "border-blue-500/20",
    bg: "bg-blue-500/5",
  },
];
export default function AsoEbiScene() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section
      id="scenes"
      ref={ref}
      className="relative min-h-screen flex items-center px-6 py-10 md:px-12 bg-[#0a0a0a] overflow-hidden font-poppins"
    >
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.2 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
          // src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=1600"
          src="/gr1.jpeg"
          alt="Fabric texture"
          className="w-full h-full object-cover opacity-30 transition-opacity duration-1000"
        />

        {/* Left-to-right dark fade — heavier black so left-column text stays legible */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/40 z-10" /> */}

        {/* Top fade to keep section edges clean */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/60" />

        {/* Green tint neutraliser — knocks back any strong green cast */}
        <div className="absolute inset-0 bg-black/30 z-10" />
      </div>

      <div className="container mx-auto relative z-20 grid lg:grid-cols-2 gap-20 items-center">
        {/* Editorial Content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-[12vw] md:text-[7vw] font-black leading-[0.85] tracking-tighter text-white mb-8 uppercase">
            Aso-Ebi <br />
            {/* ↓ Shifted from emerald (clashes with green bg) to white-to-lime for contrast */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-lime-300">
              Sync.
            </span>
          </h2>
          <p className="text-lg md:text-xl font-medium text-zinc-300 max-w-lg leading-relaxed mb-10">
            Coordinate matching fabrics without the WhatsApp chaos. Automate
            tracking for payments, delivery, and tailoring sizes for your inner
            circle.
          </p>

          <div className="flex items-center gap-4 text-white text-[10px] font-bold uppercase tracking-widest">
            <div className="h-[1px] w-12 bg-white" />
            Reliable Logistics
          </div>
        </motion.div>

        {/* High-Fidelity UI Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
          animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative group perspective-1000"
        >
          <div className="absolute -inset-px bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] blur-sm opacity-60" />
          <div className="relative bg-zinc-950/60 backdrop-blur-3xl border border-emerald-200 p-4 md:p-10 rounded-[2.5rem] shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h4 className="font-black text-3xl text-white tracking-tight">
                Fabric Ledger
              </h4>
              <div className="bg-white/10 p-3 rounded-2xl">
                <MessageSquare size={20} className="text-white" />
              </div>
            </div>

            {/* Scrolling list container */}
            <div className="relative h-[220px] overflow-hidden">
              {/* Top + bottom fade masks */}
              <div className="pointer-events-none absolute top-0 inset-x-0 h-10 z-10 bg-gradient-to-b from-zinc-950/60 to-transparent" />
              <div className="pointer-events-none absolute bottom-0 inset-x-0 h-10 z-10 bg-gradient-to-t from-zinc-950/60 to-transparent" />

              {/* The scroll track — duplicated for seamless loop */}
              <motion.div
                className="space-y-3"
                animate={{ y: ["0%", "-50%"] }}
                transition={{
                  duration: 12,
                  ease: "linear",
                  repeat: Infinity,
                }}
              >
                {/* Render the list twice so it loops seamlessly */}
                {[...asoEbiPeople, ...asoEbiPeople].map((p, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center p-3 md:p-4 rounded-2xl border transition-all duration-500 ${p.borderColor} ${p.bg}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center font-black text-white text-xs">
                        {p.initials}
                      </div>
                      <div>
                        <span className="block font-bold text-white text-sm">
                          {p.name}
                        </span>
                        <span className="text-[11px] font-medium text-zinc-300 tracking-wider">
                          Family Circle
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.icon}
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-10 bg-white hover:bg-zinc-100 text-zinc-900 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all"
            >
              Nudge Remaining Guests
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
