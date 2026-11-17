// Fixed positions so server and client render identically.
const motes = [
  { left: "8%", top: "22%", size: 6, delay: 0 },
  { left: "18%", top: "68%", size: 4, delay: 2.4 },
  { left: "31%", top: "38%", size: 3, delay: 4.1 },
  { left: "46%", top: "80%", size: 5, delay: 1.2 },
  { left: "62%", top: "16%", size: 4, delay: 3.3 },
  { left: "74%", top: "56%", size: 6, delay: 0.7 },
  { left: "86%", top: "30%", size: 3, delay: 5.2 },
  { left: "92%", top: "72%", size: 5, delay: 2.9 },
];

/** Soft floating specks of warm light. */
export default function Motes() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {motes.map((m, i) => (
        <span
          key={i}
          className="absolute animate-float rounded-full bg-[#f6dcc4] blur-[1px]"
          style={{
            left: m.left,
            top: m.top,
            width: m.size,
            height: m.size,
            animationDelay: `${m.delay}s`,
            boxShadow: "0 0 18px 6px rgb(246 220 196 / 0.35)",
          }}
        />
      ))}
    </div>
  );
}
