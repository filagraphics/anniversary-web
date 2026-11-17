"use client";

import { motion } from "framer-motion";
import { letter } from "@/data/messages";

const ease = [0.22, 1, 0.36, 1] as const;

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

          <div className="letter-lines mt-10 font-serif text-[1.08rem] leading-[2.25rem] text-ink/85 sm:text-[1.18rem]">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-hand text-3xl text-mocha-deep"
            >
              {letter.greeting}
            </motion.p>
            {letter.paragraphs.map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -5% 0px" }}
                transition={{ duration: 1.1, delay: 0.45 + i * 0.25, ease }}
                className="mt-[2.25rem]"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.6 }}
            className="mt-12 text-right"
          >
            <p className="font-serif text-ink/70 italic">
              {letter.signOff}{" "}
              <span lang="am" className="font-amharic text-sm not-italic text-mocha-deep">
                · {letter.signOffAm}
              </span>
            </p>
            <p className="mt-1 -rotate-2 font-hand text-5xl text-ink">{letter.signature}</p>
          </motion.div>
        </motion.article>
      </div>
    </section>
  );
}
