// ─── app/page.tsx ───────────────────────────────────────────
import Navbar from "@/components/owambe/Navbar";
import HeroScene from "@/components/owambe/HeroScene";
import AsoEbiScene from "@/components/owambe/AsoEbiScene";
import VendorScene from "@/components/owambe/VendorScene";
import DigitalSprayingScene from "@/components/owambe/DigitalSprayingScene";
import ComparisonSection from "@/components/owambe/ComparisonSection";
import CtaSection from "@/components/owambe/CtaSection";
import AliceChatWidget from "@/components/landing/alice-chat-widget";
// import AliceAgent from "@/components/owambe/AliceAgent";
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
