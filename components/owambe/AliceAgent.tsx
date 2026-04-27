// ─── components/owambe/AliceAgent.tsx ───────────────────────
"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "alice" | "user";
  text: string;
}

export default function AliceAgent() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "alice",
      text: "E k'abo! (Welcome!) I'm Alice. Ready to plan an unforgettable Owambe? I can help with Aso-Ebi coordination, vendor sync, or digital gift walls. What's the occasion?",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "alice",
          text: "Wonderful! Let's get the details sorted. Tell me more about your event date and expected guest count.",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="mb-4 w-80 md:w-96 bg-white flex flex-col overflow-hidden"
            style={{
              border: "1px solid #1A1A1A",
              boxShadow: "10px 10px 0px #1A1A1A",
            }}
          >
            {/* Header */}
            <div className="bg-[#1A1A1A] text-[#FACC15] p-4 flex justify-between items-center border-b border-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FACC15] text-[#1A1A1A] flex items-center justify-center font-black text-sm">
                  A
                </div>
                <div>
                  <h4 className="font-black uppercase text-xs tracking-widest">
                    Alice
                  </h4>
                  <p className="text-[8px] font-bold opacity-60">
                    Event Planning Expert
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="hover:scale-110 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-72 p-4 bg-[#F9F7F2] overflow-y-auto space-y-3 text-sm">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] p-3 border border-[#1A1A1A] text-[#1A1A1A] text-sm font-medium ${
                    m.role === "user" ? "ml-auto bg-[#FACC15]" : "bg-white"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-[#1A1A1A] flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask Alice anything..."
                className="flex-1 bg-[#F9F7F2] p-2 text-xs font-bold border border-[#1A1A1A] focus:outline-none placeholder:opacity-50"
              />
              <button
                onClick={sendMessage}
                className="bg-[#FACC15] text-[#1A1A1A] px-3 py-2 border border-[#1A1A1A] font-black text-xs hover:bg-[#1A1A1A] hover:text-[#FACC15] transition-colors flex items-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        className="bg-[#FACC15] text-[#1A1A1A] w-16 h-16 rounded-full flex items-center justify-center hover:scale-105 transition-transform active:translate-y-1"
        style={{
          border: "1px solid #1A1A1A",
          boxShadow: "5px 5px 0px #1A1A1A",
        }}
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
}
