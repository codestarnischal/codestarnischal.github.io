"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import KineticLink from "@/components/KineticLink";

const GOLD = "#D4AF37";
const SILK = "#F8F5F0";
const SILK_DIM = "rgba(248,245,240,0.45)";

export interface ChapterStanza {
  heading: string;
  body: string;
}

interface ChapterPageProps {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  stanzas: ChapterStanza[];
  children?: ReactNode;
}

export default function ChapterPage({ eyebrow, title, lede, stanzas, children }: ChapterPageProps) {
  return (
    <main className="relative min-h-screen px-8 pt-48 pb-40">
      <div className="max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.15em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-xs uppercase mb-10"
          style={{ color: GOLD, fontWeight: 300 }}
        >
          {eyebrow}
        </motion.p>

        <div className="overflow-hidden mb-16">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="leading-[1.05]"
            style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 300,
              color: SILK,
              letterSpacing: "-0.02em",
              fontStyle: "italic",
            }}
          >
            {title}
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.7 }}
          className="leading-[2] mb-24"
          style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
            color: "rgba(248,245,240,0.7)",
            fontWeight: 300,
            fontStyle: "italic",
          }}
        >
          {lede}
        </motion.p>

        <div className="space-y-20">
          {stanzas.map((stanza, i) => (
            <motion.section
              key={stanza.heading}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <h2
                className="text-sm tracking-[0.3em] uppercase mb-6"
                style={{ color: GOLD, fontWeight: 300 }}
              >
                {stanza.heading}
              </h2>
              <p
                className="leading-[1.9]"
                style={{ fontSize: "1.05rem", color: SILK_DIM, fontWeight: 300 }}
              >
                {stanza.body}
              </p>
            </motion.section>
          ))}
        </div>

        {children}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-32 flex items-center gap-10"
        >
          <KineticLink href="/">
            <span className="text-xs tracking-[0.35em] uppercase" style={{ color: SILK_DIM, fontWeight: 300 }}>
              ← Return
            </span>
          </KineticLink>
          <span style={{ color: "rgba(212,175,55,0.25)" }}>·</span>
          <KineticLink href="/acquire">
            <span className="text-xs tracking-[0.35em] uppercase" style={{ color: GOLD, fontWeight: 300 }}>
              Commission a Piece
            </span>
          </KineticLink>
        </motion.div>
      </div>
    </main>
  );
}
