import Reveal from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  id?: string;
  tone?: "light" | "dark";
  align?: "center" | "left";
};

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  tone = "light",
  align = "center",
}: Props) {
  const dark = tone === "dark";
  return (
    <Reveal
      className={`mx-auto max-w-2xl ${align === "center" ? "text-center" : "text-left"}`}
    >
      <p
        className={`mb-4 flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.32em] ${
          align === "center" ? "justify-center" : ""
        } ${dark ? "text-rose" : "text-mocha-deep"}`}
      >
        <span aria-hidden className={`h-px w-8 ${dark ? "bg-rose/60" : "bg-rose"}`} />
        {eyebrow}
        <span aria-hidden className={`h-px w-8 ${dark ? "bg-rose/60" : "bg-rose"}`} />
      </p>
      <h2
        id={id}
        className={`font-serif text-[2.1rem] leading-[1.1] tracking-tight sm:text-5xl ${
          dark ? "text-paper" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-5 text-base leading-relaxed sm:text-lg ${
            dark ? "text-paper/75" : "text-ink/70"
          }`}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
