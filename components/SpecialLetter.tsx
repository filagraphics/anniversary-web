"use client";

import { motion } from "framer-motion";
import { letter } from "@/data/messages";
import { ease } from "@/lib/motion";

export default function SpecialLetter() {
  return (
    <section
      id="letter"
      aria-labelledby="letter-title"
      className="relative overflow-hidden bg-cream px-4 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-3xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-8 text-center text-[0.7rem] font-medium uppercase tracking-[0.32em] text-mocha-deep"
        >
          {letter.eyebrow}
        </motion.p>

        <motion.article
          initial={{ opacity: 0, y: 40, rotate: -0.6 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.4, ease }}
          className="paper-texture relative rounded-[6px] px-6 py-12 shadow-lift ring-1 ring-mocha/10 sm:px-14 sm:py-16"
        >
          {/* Folded-paper crease and a soft wax seal. */}
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-mocha/10 to-transparent" />
          <span
            aria-hidden
            className="absolute -top-5 left-1/2 grid size-10 -translate-x-1/2 place-items-center rounded-full bg-rose-deep font-serif text-sm text-paper italic shadow-soft"
          >
            6
          </span>

          <h2 id="letter-title" className="text-center font-serif text-4xl text-ink italic sm:text-5xl">
            {letter.title}
          </h2>
          <div aria-hidden className="mx-auto mt-6 h-px w-16 bg-rose" />

          {/* The verse */}
          <motion.figure
            lang="am"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.3, ease }}
            className="mt-10 text-center"
          >
            <blockquote className="space-y-5 font-amharic text-[1.12rem] leading-[2] text-ink/85 sm:text-[1.3rem]">
              {letter.verse.lines.map((line, i) => (
                <motion.p
                  key={line.n}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.5 + i * 0.3, ease }}
                >
                  <sup className="mr-1.5 font-serif text-[0.65em] text-rose-deep">{line.n}</sup>
                  {line.text}
                </motion.p>
              ))}
            </blockquote>
            <div aria-hidden className="mt-9 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-rose" />
              <span className="size-1.5 rotate-45 bg-rose-deep" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-rose" />
            </div>
            <figcaption className="mt-5 font-amharic text-sm tracking-wide text-mocha-deep sm:text-base">{letter.verse.reference}</figcaption>
          </motion.figure>
        </motion.article>
      </div>
    </section>
  );
}
