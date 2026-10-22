import Link from "next/link";

export default function PlayPage() {
  return (
    <section className="flex h-full items-center justify-center p-6">
      <div className="glass-panel max-w-2xl p-8 text-center text-white">
        <h1 className="text-3xl font-bold uppercase tracking-wide">Play</h1>
        <p className="mt-4 text-sm uppercase tracking-wider text-white/70">
          The legacy Play page has not been analyzed yet. This route is kept active so navigation and layout remain stable.
        </p>
        <Link
          href="/search"
          className="mt-6 inline-block rounded-full border border-pokemon-accent px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-pokemon-accent"
        >
          Back to search
        </Link>
      </div>
    </section>
  );
}
