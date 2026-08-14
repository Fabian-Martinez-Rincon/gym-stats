export function Decor() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <div
        className="absolute rounded-full"
        style={{
          top: "-20vmin",
          right: "-16vmin",
          width: "48vmin",
          height: "48vmin",
          background: "var(--brand)",
          opacity: 0.14,
          filter: "blur(50px)",
          animation: "drift-a 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          bottom: "-22vmin",
          left: "-18vmin",
          width: "40vmin",
          height: "40vmin",
          background: "var(--brand)",
          opacity: 0.09,
          filter: "blur(50px)",
          animation: "drift-b 26s ease-in-out infinite",
        }}
      />
    </div>
  );
}
