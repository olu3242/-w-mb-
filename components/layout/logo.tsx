import { cn } from "@/lib/utils";
import Link from "next/link";

export const Logo = ({ width = "w-[160px]" }) => {
  return (
    <Link href="/" className="inline-block">
      <img src="/logo.svg" alt="logo" className={cn("h-auto", width)} />
    </Link>
  );
};

export const LogoFooter = ({ width = "w-[160px]" }) => {
  return (
    <Link href="/" className="inline-block">
      <img src="/logofooter.svg" alt="logo" className={cn("h-auto", width)} />
    </Link>
  );
};
