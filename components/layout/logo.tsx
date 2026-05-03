import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="relative z-[110]">
      <span className="font-serif italic font-black text-3xl tracking-tighter transition-colors duration-500">
        Owambe.
      </span>
    </Link>
  );
};
