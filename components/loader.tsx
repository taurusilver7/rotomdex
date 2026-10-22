import Image from "next/image";

export function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-white/80">
      <Image src="/pokeball-loader.gif" alt={label} width={64} height={64} unoptimized />
      <span className="animate-pulse uppercase tracking-widest">{label}...</span>
    </div>
  );
}
