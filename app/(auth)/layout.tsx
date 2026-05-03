// export default function AuthLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex min-h-screen items-center justify-center p-4">
//       <div className="w-full max-w-sm">{children}</div>
//     </div>
//   )
// }

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <div
    //   className="relative min-h-screen w-full flex items-center justify-center p-4"
    //   style={{
    //     backgroundImage:
    //       "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80')",
    //     backgroundSize: "cover",
    //     backgroundPosition: "center",
    //   }}
    // >
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/gr2.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark cinematic overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">{children}</div>
    </div>
  );
}
