'use client'

import { useState } from 'react'

export default function AliceChatWidget() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {open && (
        <div className="mb-4 w-80 md:w-96 bg-white system-border shadow-[10px_10px_0px_#1A1A1A] flex flex-col overflow-hidden">
          <div className="bg-charcoal text-lemon p-4 flex justify-between items-center border-b border-charcoal">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-lemon text-charcoal flex items-center justify-center font-black text-sm">A</div>
              <div>
                <h4 className="font-black uppercase text-xs tracking-widest">Alice</h4>
                <p className="text-[8px] font-bold opacity-60">Event Planning Expert</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-lemon hover:scale-110 transition-transform text-lg leading-none">✕</button>
          </div>
          <div className="h-80 p-4 overflow-y-auto space-y-4 text-sm bg-offwhite">
            <div className="bg-white p-3 system-border max-w-[85%]">
              <p className="font-bold">E k&#x27;abo! (Welcome!)</p>
              <p className="mt-1">I&#x27;m Alice. Ready to plan an unforgettable Owambe? I can help with Aso-Ebi coordination, vendor sync, or digital gift walls. What&#x27;s the occasion?</p>
            </div>
          </div>
          <div className="p-4 bg-white border-t border-charcoal flex gap-2">
            <input
              type="text"
              placeholder="Ask Alice anything..."
              className="flex-1 bg-offwhite p-2 text-xs font-bold border border-charcoal focus:outline-none placeholder:opacity-50"
            />
            <button className="bg-lemon text-charcoal px-4 py-2 system-border font-black text-xs hover:bg-charcoal hover:text-lemon transition-colors">
              SEND
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        className="bg-lemon text-charcoal w-16 h-16 rounded-full system-border shadow-[5px_5px_0px_#1A1A1A] flex items-center justify-center hover:scale-105 transition-transform active:translate-y-1"
        aria-label="Chat with Alice"
      >
        <i className="fa-solid fa-comment-dots text-2xl"></i>
      </button>
    </div>
  )
}
