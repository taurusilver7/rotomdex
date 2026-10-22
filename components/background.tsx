export function Background() {
  const images = ["/pokeball.png", "/pokeball2.png", "/pokeball.png", "/pokeball2.png", "/pokeball.png", "/pokeball2.png"];

  return (
    <div className="pointer-events-none absolute inset-0 z-0 grid max-h-screen grid-cols-3 gap-8 overflow-hidden p-8" aria-hidden="true">
      {images.map((src, index) => (
        <div key={index} className="flex items-center justify-center">
          <img src={src} alt="" className="h-80 w-auto max-w-full object-contain opacity-20 blur-md" />
        </div>
      ))}
    </div>
  );
}