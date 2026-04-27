"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "unset";
  }, [isSidebarOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] font-poppins transition-all duration-500 ${
          isScrolled
            ? "py-4 bg-white/90 backdrop-blur-xl"
            : "py-8 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="relative z-[110]">
            <span
              className={`font-serif italic font-black text-3xl tracking-tighter transition-colors duration-500 ${
                isScrolled ? "text-zinc-950" : "text-white mix-blend-difference"
              }`}
            >
              Owambe.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <a
              href="#scenes"
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-50 ${
                isScrolled ? "text-zinc-900" : "text-white"
              }`}
            >
              The Scenes
            </a>

            <Link href="/signup">
              <button className="group flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest transition-all active:scale-95">
                Start Planning
                <ArrowUpRight
                  size={14}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </button>
            </Link>
          </div>

          {/* Mobile Toggle (Hamburger only) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`md:hidden p-2 transition-colors ${
              isScrolled ? "text-zinc-950" : "text-white"
            }`}
          >
            {/* <Menu size={28} strokeWidth={1.5} /> */}
            <div className="space-y-2">
              <div
                className={cn(
                  "w-6 h-0.5",
                  isScrolled ? "bg-slate-950" : "bg-white"
                )}
              />
              <div
                className={cn(
                  "w-6 h-0.5",
                  isScrolled ? "bg-slate-950" : "bg-white"
                )}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* --- Right-Side Sidebar Overlay --- */}
      <div
        className={`fixed inset-0 z-[120] font-poppins transition-all duration-700 ease-[0.22, 1, 0.36, 1] ${
          isSidebarOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-zinc-950/40 backdrop-blur-md transition-opacity duration-700 ${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar Content */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-[400px] bg-white p-8 flex flex-col justify-between transition-transform duration-700 ease-[0.22, 1, 0.36, 1] ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close Icon - Absolute Top Right */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-8 right-8 p-2 text-zinc-950 hover:rotate-90 transition-transform duration-300"
          >
            <X size={32} strokeWidth={1.5} />
          </button>

          <div className="mt-24 space-y-10">
            <div className="flex flex-col gap-8">
              <a
                href="#scenes"
                onClick={() => setIsSidebarOpen(false)}
                className="text-3xl font-black uppercase tracking-tighter text-zinc-900 hover:text-green-600 transition-colors"
              >
                The Scenes
              </a>
              <Link
                href="/signup"
                onClick={() => setIsSidebarOpen(false)}
                className="text-3xl font-black uppercase tracking-tighter text-zinc-900 hover:text-green-600 transition-colors"
              >
                Start Planning
              </Link>
            </div>
          </div>

          <div className="pt-10 border-t border-zinc-100">
            <Link href="/signup" onClick={() => setIsSidebarOpen(false)}>
              <button className="w-full bg-green-600 text-white py-6 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-green-700 transition-all">
                Create New Event
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
