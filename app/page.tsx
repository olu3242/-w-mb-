// import Link from "next/link";
// import AliceChatWidget from "@/components/landing/alice-chat-widget";

// export default function LandingPage() {
//   return (
//     <div
//       className="bg-offwhite text-charcoal antialiased overflow-x-hidden min-h-screen"
//       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
//     >
//       {/* Navigation */}
//       <nav className="fixed top-0 left-0 w-full z-50 p-6 md:p-8 flex justify-between items-center mix-blend-difference invert">
//         <span className="font-serif italic font-black text-3xl tracking-tighter">
//           Owambe.
//         </span>
//         <div className="flex gap-6 items-center">
//           <a
//             href="#scenes"
//             className="text-xs font-black uppercase tracking-widest hidden md:block"
//           >
//             The Scenes
//           </a>
//           <Link
//             href="/signup"
//             className="bg-white text-black px-6 py-3 font-black uppercase text-[10px] tracking-widest"
//           >
//             Start Planning
//           </Link>
//         </div>
//       </nav>

//       {/* Scene 01: Hero — The Entrance */}
//       <section className="scene-container px-6 md:px-12 pt-20">
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1600"
//           alt="High energy Nigerian party"
//           className="scene-img"
//         />
//         <div className="scene-overlay"></div>

//         <div className="relative z-10 max-w-4xl text-white">
//           <h1 className="hero-text font-black text-[12vw] md:text-[8vw] uppercase mb-6">
//             The Party is a <br />
//             <span className="text-lemon">System.</span>
//           </h1>
//           <p className="text-xl md:text-2xl font-bold leading-tight max-w-lg mb-10">
//             Nigerian celebrations are loud, crowded, and complex. We give you
//             the controls to run them with soul.
//           </p>
//           <div className="flex flex-wrap gap-4">
//             <Link
//               href="/signup"
//               className="bg-lemon text-charcoal px-10 py-5 font-black uppercase text-sm tracking-widest system-border hover:translate-x-1 hover:translate-y-1 transition-transform"
//             >
//               Create New Event
//             </Link>
//             <Link
//               href="/signup"
//               className="bg-white text-charcoal px-10 py-5 font-black uppercase text-sm tracking-widest system-border"
//             >
//               Join an Event
//             </Link>
//           </div>
//         </div>

//         {/* Hero UI Overlay */}
//         <div className="hidden lg:block absolute right-20 top-1/2 -translate-y-1/2 ui-overlay-card p-6 w-80 text-charcoal">
//           <div className="flex justify-between items-center mb-6">
//             <span className="text-[10px] font-black uppercase tracking-widest">
//               Live Event Dashboard
//             </span>
//             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
//           </div>
//           <div className="space-y-6">
//             <div>
//               <h4 className="text-3xl font-serif italic font-black">742</h4>
//               <p className="text-[10px] font-black uppercase opacity-60">
//                 Guests Checked In
//               </p>
//             </div>
//             <div className="h-2 w-full bg-slate-100 system-border">
//               <div className="h-full w-3/4 bg-forest"></div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-xl font-bold">12</p>
//                 <p className="text-[8px] font-black uppercase opacity-60">
//                   Vendors Active
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xl font-bold">₦4.2M</p>
//                 <p className="text-[8px] font-black uppercase opacity-60">
//                   Gifts Received
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Scene 02: Aso-Ebi Coordination */}
//       <section
//         id="scenes"
//         className="scene-container px-6 md:px-12 bg-charcoal border-y border-charcoal"
//       >
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=1600"
//           alt="Matching Aso-Ebi fabrics"
//           className="scene-img"
//         />
//         <div className="scene-overlay opacity-60"></div>

//         <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center gap-12">
//           <div className="max-w-xl text-white">
//             <span className="text-xs font-black uppercase tracking-widest text-lemon mb-4 block">
//               01 / The Uniform
//             </span>
//             <h2 className="hero-text font-black text-6xl md:text-8xl uppercase leading-none mb-8">
//               Aso-Ebi <br />
//               Sync.
//             </h2>
//             <p className="text-xl font-bold opacity-80">
//               Coordinate your matching fabrics without the chaos. Track
//               payments, delivery, and tailoring sizes for 50 or 500 friends.
//             </p>
//           </div>

//           {/* Aso-Ebi UI Overlay */}
//           <div className="ui-overlay-card p-8 w-full max-w-md text-charcoal">
//             <h4 className="font-serif italic font-black text-2xl mb-6">
//               Fabric Distribution
//             </h4>
//             <div className="space-y-4">
//               <div className="flex justify-between items-center p-3 border-b border-charcoal/5">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-bold text-sm">
//                     AT
//                   </div>
//                   <span className="font-bold">Aunty Titi</span>
//                 </div>
//                 <span className="text-[10px] font-black uppercase bg-forest/10 text-forest px-2 py-1">
//                   Delivered
//                 </span>
//               </div>
//               <div className="flex justify-between items-center p-3 border-b border-charcoal/5">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-full bg-coral text-white flex items-center justify-center font-bold text-sm">
//                     OO
//                   </div>
//                   <span className="font-bold">Ola Otunba</span>
//                 </div>
//                 <span className="text-[10px] font-black uppercase bg-lemon/20 text-charcoal px-2 py-1">
//                   Payment Pending
//                 </span>
//               </div>
//               <div className="flex justify-between items-center p-3">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center font-bold text-sm">
//                     BS
//                   </div>
//                   <span className="font-bold">Bode Smith</span>
//                 </div>
//                 <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-400 px-2 py-1">
//                   Not Paid
//                 </span>
//               </div>
//             </div>
//             <button className="w-full mt-8 bg-charcoal text-white py-4 font-black uppercase text-xs tracking-widest">
//               Message Unpaid Guests
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Scene 03: The Jollof, Big Chicken & Drinks */}
//       <section className="scene-container px-6 md:px-12">
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           src="https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=1600"
//           alt="Vibrant Jollof rice with chicken"
//           className="scene-img"
//         />
//         <div
//           className="scene-overlay"
//           style={{
//             background:
//               "linear-gradient(to left, rgba(26,26,26,0.8) 0%, transparent 60%)",
//           }}
//         ></div>

//         <div className="relative z-10 w-full flex flex-col md:flex-row-reverse justify-between items-center gap-12">
//           <div className="max-w-xl text-white md:text-right">
//             <span className="text-xs font-black uppercase tracking-widest text-forest mb-4 block">
//               02 / The Abundance
//             </span>
//             <h2 className="hero-text font-black text-6xl md:text-8xl uppercase leading-none mb-8">
//               Vendor <br /> Control.
//             </h2>
//             <p className="text-xl font-bold opacity-80">
//               From the smokey Jollof rice and big pieces of chicken to assorted
//               chilled drinks. Every vendor is synced to your real-time event
//               timeline. No &ldquo;African Time&rdquo; excuses.
//             </p>
//           </div>

//           {/* Vendor UI Overlay */}
//           <div className="ui-overlay-card p-8 w-full max-w-sm text-charcoal">
//             <div className="flex items-center gap-4 mb-8">
//               <i className="fa-solid fa-wine-glass text-3xl text-forest"></i>
//               <div>
//                 <h4 className="font-black uppercase text-xs tracking-widest">
//                   Catering &amp; Drinks
//                 </h4>
//                 <p className="font-serif italic font-black text-xl">
//                   Iya Basira Kitchen
//                 </p>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <div className="flex items-center gap-4 text-sm font-bold">
//                 <i className="fa-solid fa-circle-check text-forest"></i>
//                 <span>Jollof Rice &amp; Chicken Ready (12:30 PM)</span>
//               </div>
//               <div className="flex items-center gap-4 text-sm font-bold">
//                 <i className="fa-solid fa-spinner animate-spin text-lemon"></i>
//                 <span>Assorted Drinks Service (In Progress)</span>
//               </div>
//               <div className="flex items-center gap-4 text-sm font-bold opacity-30">
//                 <i className="fa-solid fa-circle"></i>
//                 <span>Small Chops Refill (Scheduled 4:00 PM)</span>
//               </div>
//             </div>
//             <div className="mt-8 pt-6 border-t border-charcoal/10 flex justify-between">
//               <span className="text-[10px] font-black uppercase">
//                 Balance Paid
//               </span>
//               <span className="font-bold text-forest">₦850,000 / ₦1.2M</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Scene 04: Digital Spraying */}
//       <section className="scene-container px-6 md:px-12 bg-forest">
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1600"
//           alt="Action money spraying"
//           className="scene-img"
//         />
//         <div className="scene-overlay opacity-80"></div>

//         <div className="relative z-10 w-full grid md:grid-cols-2 items-center gap-20">
//           <div className="text-white">
//             <h2 className="hero-text font-black text-6xl md:text-[8vw] uppercase leading-none">
//               Digital <br /> <span className="text-lemon">Spraying.</span>
//             </h2>
//             <p className="text-2xl font-bold mt-10 max-w-xl">
//               The tradition is communal, but the cash is messy. We&#x27;ve
//               digitized spraying. Guests contribute instantly via link, and the
//               celebrants see the joy in real-time.
//             </p>
//             <div className="mt-12 space-y-6">
//               <div className="flex items-center gap-6">
//                 <div className="w-16 h-16 bg-white/10 flex items-center justify-center rounded-2xl system-border">
//                   <i className="fa-solid fa-bolt-lightning text-lemon text-2xl"></i>
//                 </div>
//                 <p className="font-bold">
//                   Instant notification for the celebrant.
//                 </p>
//               </div>
//               <div className="flex items-center gap-6">
//                 <div className="w-16 h-16 bg-white/10 flex items-center justify-center rounded-2xl system-border">
//                   <i className="fa-solid fa-shield-heart text-coral text-2xl"></i>
//                 </div>
//                 <p className="font-bold">
//                   No more lost envelopes or missing cash.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Gift Wall UI Overlay */}
//           <div className="ui-overlay-card p-0 overflow-hidden text-charcoal">
//             <div className="bg-charcoal text-lemon p-4 flex justify-between items-center">
//               <span className="text-[10px] font-black uppercase tracking-widest">
//                 Live Gift Wall
//               </span>
//               <span className="font-serif italic font-black text-xl">
//                 Total: ₦4,240,000
//               </span>
//             </div>
//             <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
//               <div className="flex items-center gap-4 bg-slate-50 p-3 system-border">
//                 <div className="w-10 h-10 bg-forest text-white rounded-full flex items-center justify-center font-black text-sm">
//                   UB
//                 </div>
//                 <div>
//                   <p className="text-xs font-black uppercase">Uncle Bode</p>
//                   <p className="text-lg font-serif italic font-black text-forest">
//                     ₦500,000
//                   </p>
//                 </div>
//                 <span className="ml-auto text-[8px] font-black uppercase opacity-40">
//                   2m ago
//                 </span>
//               </div>
//               <div className="flex items-center gap-4 bg-white p-3 system-border">
//                 <div className="w-10 h-10 bg-coral text-white rounded-full flex items-center justify-center font-black text-sm">
//                   CC
//                 </div>
//                 <div>
//                   <p className="text-xs font-black uppercase">Cousins Club</p>
//                   <p className="text-lg font-serif italic font-black text-forest">
//                     ₦1,200,000
//                   </p>
//                 </div>
//                 <span className="ml-auto text-[8px] font-black uppercase opacity-40">
//                   5m ago
//                 </span>
//               </div>
//               <div className="flex items-center gap-4 bg-white p-3 system-border">
//                 <div className="w-10 h-10 bg-charcoal text-white rounded-full flex items-center justify-center font-black text-sm">
//                   YF
//                 </div>
//                 <div>
//                   <p className="text-xs font-black uppercase">Yemi Friends</p>
//                   <p className="text-lg font-serif italic font-black text-forest">
//                     ₦150,000
//                   </p>
//                 </div>
//                 <span className="ml-auto text-[8px] font-black uppercase opacity-40">
//                   12m ago
//                 </span>
//               </div>
//             </div>
//             <div className="p-6 bg-lemon/10">
//               <Link
//                 href="/signup"
//                 className="block w-full bg-charcoal text-lemon py-4 font-black uppercase text-xs tracking-widest text-center hover:scale-105 transition-transform"
//               >
//                 Spray Your Gift
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* The Comparison */}
//       <section className="py-24 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 border-b border-charcoal">
//         <div className="p-10 md:p-20 border-b md:border-b-0 md:border-r border-charcoal flex flex-col justify-center bg-white">
//           <span className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-6">
//             The Old Way
//           </span>
//           <h3 className="text-5xl font-black uppercase leading-tight mb-8">
//             Manual <br /> Chaos.
//           </h3>
//           <ul className="space-y-4 font-bold opacity-60">
//             <li>• Lost fabric payments in WhatsApp threads</li>
//             <li>• Unreliable vendor arrival times</li>
//             <li>• Guest list inflation (uninvited &ldquo;plus-tens&rdquo;)</li>
//             <li>• Missing cash from the dance floor</li>
//           </ul>
//         </div>
//         <div className="p-10 md:p-20 flex flex-col justify-center bg-lemon">
//           <span className="text-[10px] font-black uppercase tracking-widest text-forest mb-6">
//             The Owambe Way
//           </span>
//           <h3 className="text-5xl font-black uppercase leading-tight mb-8">
//             Systemic <br /> Joy.
//           </h3>
//           <ul className="space-y-4 font-bold text-charcoal">
//             <li>• Automated Aso-Ebi ledger and logistics</li>
//             <li>• Real-time vendor coordination dashboard</li>
//             <li>• QR-code secure guest check-in</li>
//             <li>• Secure digital spraying and instant payout</li>
//           </ul>
//         </div>
//       </section>

//       {/* Final CTA */}
//       <section
//         id="join"
//         className="py-32 px-6 md:px-12 text-center bg-offwhite"
//       >
//         <div className="max-w-4xl mx-auto">
//           <h2 className="hero-text font-black text-7xl md:text-[10vw] uppercase leading-none mb-12">
//             The Party <br /> Starts Here.
//           </h2>
//           <div className="flex flex-col md:flex-row justify-center gap-6">
//             <Link
//               href="/signup"
//               className="bg-charcoal text-offwhite px-12 py-6 text-xl font-black uppercase system-border hover:bg-lemon hover:text-charcoal transition-all"
//             >
//               Plan My Owambe
//             </Link>
//             <Link
//               href="/login"
//               className="border-2 border-charcoal text-charcoal px-12 py-6 text-xl font-black uppercase hover:bg-coral hover:text-white transition-all"
//             >
//               I&#x27;m a Guest
//             </Link>
//           </div>
//           <p className="mt-16 text-[10px] font-black uppercase tracking-[0.5em] opacity-30">
//             Redefining celebration for the modern world.
//           </p>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="p-10 md:p-20 bg-charcoal text-offwhite/40 border-t border-white/10">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
//           <div className="col-span-2">
//             <span className="font-serif italic font-black text-5xl text-offwhite">
//               Owambe.
//             </span>
//             <p className="mt-8 text-sm font-bold max-w-xs leading-relaxed">
//               Designed for the hosts who believe that celebration is a sacred
//               tradition that deserves precise coordination.
//             </p>
//           </div>
//           <div className="space-y-6">
//             <h5 className="text-offwhite font-black text-xs uppercase tracking-widest">
//               Modules
//             </h5>
//             <ul className="text-xs font-black uppercase tracking-widest space-y-3">
//               <li>
//                 <a href="#" className="hover:text-lemon transition">
//                   Aso-Ebi Tracker
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-lemon transition">
//                   Vendor Sync
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-lemon transition">
//                   Digital Spray
//                 </a>
//               </li>
//             </ul>
//           </div>
//           <div className="space-y-6">
//             <h5 className="text-offwhite font-black text-xs uppercase tracking-widest">
//               Connect
//             </h5>
//             <ul className="text-xs font-black uppercase tracking-widest space-y-3">
//               <li>
//                 <a href="#" className="hover:text-coral transition">
//                   Instagram
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-coral transition">
//                   WhatsApp
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </footer>

//       <AliceChatWidget />
//     </div>
//   );
// }

import AliceChatWidget from "@/components/landing/alice-chat-widget";

// ─── app/page.tsx ───────────────────────────────────────────
import Navbar from "@/components/owambe/Navbar";
import HeroScene from "@/components/owambe/HeroScene";
import AsoEbiScene from "@/components/owambe/AsoEbiScene";
import VendorScene from "@/components/owambe/VendorScene";
import DigitalSprayingScene from "@/components/owambe/DigitalSprayingScene";
import ComparisonSection from "@/components/owambe/ComparisonSection";
import CtaSection from "@/components/owambe/CtaSection";
import AliceAgent from "@/components/owambe/AliceAgent";
import Footer from "@/components/owambe/Footer";

export default function OwambePage() {
  return (
    <main className="bg-[#F9F7F2] text-[#1A1A1A] font-sans antialiased scroll-smooth">
      <Navbar />
      <HeroScene />
      <AsoEbiScene />
      <VendorScene />
      <DigitalSprayingScene />
      <ComparisonSection />
      <CtaSection />
      <AliceChatWidget />
      <Footer />
    </main>
  );
}
