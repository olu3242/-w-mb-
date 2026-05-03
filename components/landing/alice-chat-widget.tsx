// "use client";

// import { useState, useRef, useEffect } from "react";
// import {
//   MessageSquare,
//   X,
//   Send,
//   Sparkles,
//   Zap,
//   Users,
//   Gift,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// interface Message {
//   role: "alice" | "user";
//   text: string;
// }

// const INITIAL_MESSAGE: Message = {
//   role: "alice",
//   text: "E k'abo! I'm Alice, your systemic event lead. Ready to architect an unforgettable Owambe?",
// };

// export default function AliceChatWidget() {
//   const [open, setOpen] = useState(false);
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
//   const [isTyping, setIsTyping] = useState(false);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping]);

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     const userMsg = input;
//     setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
//     setInput("");
//     setIsTyping(true);

//     setTimeout(() => {
//       setIsTyping(false);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "alice",
//           text: "Copy that. I'm syncing with the vendor grid. Shall we start with the guest list or the digital gift wall setup?",
//         },
//       ]);
//     }, 1500);
//   };

//   return (
//     <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end font-poppins">
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
//             animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
//             exit={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
//             transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
//             className="mb-6 w-[350px] md:w-[400px] flex flex-col overflow-hidden bg-zinc-950/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
//           >
//             {/* --- Header --- */}
//             <div className="p-6 bg-white/5 border-b border-white/5 flex justify-between items-center">
//               <div className="flex items-center gap-4">
//                 <div className="relative">
//                   <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
//                     <Sparkles className="text-emerald-400" size={20} />
//                   </div>
//                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-zinc-950 rounded-full" />
//                 </div>
//                 <div>
//                   <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-emerald-400">
//                     System Lead
//                   </h4>
//                   <p className="text-xl font-serif italic font-black text-white">
//                     Alice AI
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setOpen(false)}
//                 className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             {/* --- Message Feed --- */}
//             <div className="h-[380px] p-6 overflow-y-auto space-y-6 scrollbar-hide">
//               {messages.map((m, i) => (
//                 <motion.div
//                   key={i}
//                   initial={{ opacity: 0, x: m.role === "user" ? 10 : -10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
//                 >
//                   <div
//                     className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
//                       m.role === "user"
//                         ? "bg-emerald-600 text-white rounded-tr-none"
//                         : "bg-white/5 border border-white/10 text-zinc-300 rounded-tl-none"
//                     }`}
//                   >
//                     {m.text}
//                   </div>
//                 </motion.div>
//               ))}

//               {isTyping && (
//                 <div className="flex justify-start">
//                   <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
//                     <motion.div
//                       animate={{ opacity: [0.3, 1, 0.3] }}
//                       transition={{ repeat: Infinity, duration: 1 }}
//                       className="w-1.5 h-1.5 rounded-full bg-emerald-400"
//                     />
//                     <motion.div
//                       animate={{ opacity: [0.3, 1, 0.3] }}
//                       transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
//                       className="w-1.5 h-1.5 rounded-full bg-emerald-400"
//                     />
//                     <motion.div
//                       animate={{ opacity: [0.3, 1, 0.3] }}
//                       transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
//                       className="w-1.5 h-1.5 rounded-full bg-emerald-400"
//                     />
//                   </div>
//                 </div>
//               )}
//               <div ref={bottomRef} />
//             </div>

//             {/* --- Quick Suggestions --- */}
//             <div className="px-6 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
//               {[
//                 { label: "Aso-Ebi", icon: Users },
//                 { label: "Vendors", icon: Zap },
//                 { label: "Gift Wall", icon: Gift },
//               ].map((item) => (
//                 <button
//                   key={item.label}
//                   onClick={() => setInput(item.label)}
//                   className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all"
//                 >
//                   <item.icon size={12} />
//                   {item.label}
//                 </button>
//               ))}
//             </div>

//             {/* --- Input Area --- */}
//             <div className="p-6">
//               <div className="relative flex items-center">
//                 <input
//                   type="text"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                   placeholder="Ask anything..."
//                   className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
//                 />
//                 <button
//                   onClick={sendMessage}
//                   className="absolute right-3 w-10 h-10 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl flex items-center justify-center transition-all"
//                 >
//                   <Send size={16} />
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* --- Main Toggle --- */}
//       <motion.button
//         onClick={() => setOpen(!open)}
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         className="relative group w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center shadow-[0_10px_30px_rgba(16,185,129,0.3)] overflow-hidden"
//       >
//         <AnimatePresence mode="wait">
//           {open ? (
//             <motion.div
//               key="close"
//               initial={{ rotate: -90, opacity: 0 }}
//               animate={{ rotate: 0, opacity: 1 }}
//               exit={{ rotate: 90, opacity: 0 }}
//             >
//               <X size={28} className="text-zinc-950" />
//             </motion.div>
//           ) : (
//             <motion.div
//               key="open"
//               initial={{ rotate: 90, opacity: 0 }}
//               animate={{ rotate: 0, opacity: 1 }}
//               exit={{ rotate: -90, opacity: 0 }}
//             >
//               <MessageSquare size={28} className="text-zinc-950" />
//             </motion.div>
//           )}
//         </AnimatePresence>
//         <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
//       </motion.button>
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Zap,
  Users,
  Gift,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "alice" | "user";
  text: string;
}

const INITIAL_MESSAGE: Message = {
  role: "alice",
  text: "E k'abo! I'm Alice, your systemic event lead. Ready to architect an unforgettable Owambe?",
};

export default function AliceChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "alice",
          text: "Copy that. I'm syncing with the vendor grid. Shall we start with the guest list or the digital gift wall setup?",
        },
      ]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[50] flex flex-col items-end font-poppins">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
            className="w-[350px] md:w-[400px] h-[500px] md:h-[460px] flex flex-col overflow-hidden bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
          >
            {/* --- Header --- */}
            <div className="p-6 bg-white/5 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Sparkles className="text-emerald-400" size={20} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                </div>
                <div>
                  <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-emerald-400">
                    System Lead
                  </h4>
                  <p className="text-xl font-black text-white">Alice AI</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-emerald-500 hover:text-zinc-950 transition-all duration-300"
              >
                <X size={18} />
              </button>
            </div>

            {/* --- Message Feed --- */}
            <div className="h-[350px] md:h-[400px] p-6 overflow-y-auto space-y-6 scrollbar-hide">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-emerald-600 text-white rounded-tr-none"
                        : "bg-white/5 border border-white/10 text-zinc-300 rounded-tl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1.5">
                    {[0, 1, 2].map((dot) => (
                      <motion.div
                        key={dot}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          delay: dot * 0.2,
                        }}
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* --- Suggestions --- */}
            <div className="px-6 pb-2 flex gap-2 flex-wrap">
              {[
                { label: "Aso-Ebi", icon: Users },
                { label: "Vendors", icon: Zap },
                { label: "Gift Wall", icon: Gift },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setInput(item.label)}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                >
                  <item.icon size={12} />
                  {item.label}
                </button>
              ))}
            </div>

            {/* --- Input Area --- */}
            <div className="p-6">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Talk to Alice..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/40 focus:bg-white/10 transition-all shadow-inner"
                />
                <button
                  onClick={sendMessage}
                  className="absolute right-2 w-10 h-10 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl flex items-center justify-center transition-all shadow-lg"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Main Toggle (Hides when open) --- */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="chat-toggle"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            onClick={() => setOpen(true)}
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-20 h-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center shadow-[0_15px_40px_rgba(16,185,129,0.4)]"
          >
            <MessageSquare size={30} className="text-white" />
            {/* Notification Dot */}
            <span className="absolute top-5 right-5 w-3 h-3 bg-white rounded-full border-2 border-emerald-500" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
