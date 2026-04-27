// ─── components/owambe/Footer.tsx ───────────────────────────
// import Link from "next/link";

// const modules = [
//   { label: "Aso-Ebi Tracker", href: "#" },
//   { label: "Vendor Sync", href: "#" },
//   { label: "Digital Spray", href: "#" },
// ];

// const connect = [
//   { label: "Instagram", href: "#" },
//   { label: "WhatsApp", href: "#" },
// ];

// export default function Footer() {
//   return (
//     <footer className="p-10 md:p-20 bg-[#1A1A1A] text-[#F9F7F2]/40 border-t border-white/10">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
//         <div className="col-span-2">
//           <span className="font-serif italic font-black text-5xl text-[#F9F7F2]">
//             Owambe.
//           </span>
//           <p className="mt-8 text-sm font-bold max-w-xs leading-relaxed">
//             Designed for the hosts who believe that celebration is a sacred
//             tradition that deserves precise coordination.
//           </p>
//         </div>

//         <div className="space-y-6">
//           <h5 className="text-[#F9F7F2] font-black text-xs uppercase tracking-widest">
//             Modules
//           </h5>
//           <ul className="text-xs font-black uppercase tracking-widest space-y-3">
//             {modules.map((m) => (
//               <li key={m.label}>
//                 <Link
//                   href={m.href}
//                   className="hover:text-[#FACC15] transition-colors"
//                 >
//                   {m.label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="space-y-6">
//           <h5 className="text-[#F9F7F2] font-black text-xs uppercase tracking-widest">
//             Connect
//           </h5>
//           <ul className="text-xs font-black uppercase tracking-widest space-y-3">
//             {connect.map((c) => (
//               <li key={c.label}>
//                 <Link
//                   href={c.href}
//                   className="hover:text-[#FF7F50] transition-colors"
//                 >
//                   {c.label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
//         <p className="text-[10px] font-black uppercase tracking-widest">
//           © {new Date().getFullYear()} Owambe. All rights reserved.
//         </p>
//         <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">
//           Redefining celebration for the modern world.
//         </p>
//       </div>
//     </footer>
//   );
// }

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ArrowUpRight, Globe } from "lucide-react";

const modules = [
  { label: "Aso-Ebi Tracker", href: "#" },
  { label: "Vendor Sync", href: "#" },
  { label: "Digital Spray", href: "#" },
  { label: "Guest Check-in", href: "#" },
];

const connect = [
  { label: "Instagram", href: "#", icon: MessageCircle },
  { label: "WhatsApp", href: "#", icon: MessageCircle },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#F9F7F2] pt-32 pb-12 px-6 md:px-12 border-t border-zinc-200 overflow-hidden font-poppins">
      {/* Massive Background Ghost Text */}
      <div className="absolute -bottom-10 left-0 w-full text-center pointer-events-none select-none overflow-hidden">
        <h2 className="text-[25vw] font-black leading-none text-zinc-950/[0.03] tracking-tighter">
          OWAMBE
        </h2>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* Brand Identity */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="inline-block group">
              <span className="font-serif italic font-black text-6xl text-zinc-900 transition-transform duration-500 block group-hover:-translate-y-1">
                Owambe.
              </span>
              <div className="h-1 w-0 bg-emerald-500 group-hover:w-full transition-all duration-500" />
            </Link>
            <p className="text-lg font-medium text-zinc-500 max-w-sm leading-relaxed">
              Designed for the hosts who believe that celebration is a sacred
              tradition that deserves architectural precision and systemic joy.
            </p>
          </div>

          {/* Navigation Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 lg:pl-12">
            {/* Column 1: Modules */}
            <div className="space-y-8">
              <h5 className="text-zinc-900 font-black text-[10px] uppercase tracking-[0.3em]">
                Product
              </h5>
              <ul className="space-y-4">
                {modules.map((m) => (
                  <li key={m.label}>
                    <Link
                      href={m.href}
                      className="group flex items-center gap-1 text-sm font-bold text-zinc-500 hover:text-emerald-600 transition-all"
                    >
                      {m.label}
                      <ArrowUpRight
                        size={14}
                        className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Socials */}
            <div className="space-y-8">
              <h5 className="text-zinc-900 font-black text-[10px] uppercase tracking-[0.3em]">
                Social
              </h5>
              <ul className="space-y-4">
                {connect.map((c) => (
                  <li key={c.label}>
                    <Link
                      href={c.href}
                      className="group flex items-center gap-3 text-sm font-bold text-zinc-500 hover:text-emerald-600 transition-all"
                    >
                      <c.icon
                        size={16}
                        className="text-zinc-300 group-hover:text-emerald-500"
                      />
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact (Optional extra) */}
            <div className="hidden md:block space-y-8">
              <h5 className="text-zinc-900 font-black text-[10px] uppercase tracking-[0.3em]">
                Contact
              </h5>
              <div className="space-y-4">
                <p className="text-sm font-bold text-zinc-500 cursor-pointer hover:text-zinc-900 transition-colors">
                  hello@owambe.io
                </p>
                <p className="text-sm font-bold text-zinc-500">
                  Lagos, NG — Worldwide
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-32 pt-12 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8 order-2 md:order-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              © 2026 OWAMBE SYSTEMS.
            </p>
            <Link
              href="#"
              className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-emerald-600"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-emerald-600"
            >
              Terms
            </Link>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 order-1 md:order-2 px-6 py-2 rounded-full bg-zinc-900 text-[#F9F7F2] text-[10px] font-black uppercase tracking-widest cursor-pointer"
          >
            Redefining Celebration{" "}
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
